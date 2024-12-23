package net.cakeyfox.foxy.modules.antiraid

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.interactions.DiscordLocale
import java.util.concurrent.TimeUnit
import kotlin.reflect.jvm.jvmName

class AntiRaidSystem(
    val instance: FoxyInstance
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val joinCache: Cache<String, MutableList<Long>> = Caffeine.newBuilder()
        .expireAfterWrite(10, TimeUnit.SECONDS)
        .build()

    private val messageCache: Cache<String, MutableList<Long>> = Caffeine.newBuilder()
        .expireAfterWrite(5, TimeUnit.SECONDS)
        .build()

    // Will store the alerts to avoid alert spam
    private val alertsSent: Cache<String, Unit> = Caffeine.newBuilder()
        .expireAfterWrite(5, TimeUnit.SECONDS)
        .build()

    private val parsedLocale = hashMapOf(
        DiscordLocale.PORTUGUESE_BRAZILIAN to "pt-br",
        DiscordLocale.ENGLISH_US to "en-us",
    )

    suspend fun handleJoin(event: GuildMemberJoinEvent) {
        val guildId = event.guild.idLong
        val guildInfo = instance.mongoClient.utils.guild.getGuild(event.guild.id)
        val locale = FoxyLocale(parsedLocale[event.guild.locale] ?: "en-us")

        if (guildInfo.antiRaidModule.handleJoin) {
            val currentTimestamp = System.currentTimeMillis()
            val timestamps = joinCache.get(guildId.toString()) { mutableListOf() }
            val joinThreshold = guildInfo.antiRaidModule.newUsersThreshold
            val channelId = guildInfo.antiRaidModule.alertChannel ?: return
            val userId = event.user.id
            val action = guildInfo.antiRaidModule.actionForMassJoin

            timestamps.add(currentTimestamp)

            if ((timestamps?.size ?: 0) > joinThreshold) {
                sendWarningToAChannel(userId, channelId) {
                    embed {
                        title = pretty(FoxyEmotes.FoxyRage, locale["antiraid.title"])
                        description = locale["antiraid.membersJoiningTooQuickly"]
                        color = Colors.RED
                        thumbnail = event.user.avatarUrl
                        field {
                            name = pretty(FoxyEmotes.FoxyDrinkingCoffee, locale["antiraid.fields.user"])
                            value = "${event.user.name} (`${event.user.id}`)"
                            inline = false
                        }

                        field {
                            name = pretty(FoxyEmotes.FoxyBan, locale["antiraid.fields.actionTaken"])
                            value = locale["antiraid.actions.$action"]
                            inline = false
                        }
                    }
                }

                try {
                    if (action != null) {
                        takeAnAction(
                            event.guild,
                            event.user,
                            action,
                            locale["antiraid.reasons.userIsSendingMessagesTooFast"],
                            guildInfo
                        )
                    }
                } catch (e: Exception) {
                    logger.warn { "Can't take an action for user $userId on ${event.guild.id}! Error: ${e.message}" }
                }
            }
        }
    }

    suspend fun handleMessage(event: MessageReceivedEvent) {
        val guildInfo = instance.mongoClient.utils.guild.getGuild(event.guild.id)
        val userId = "${event.guild.id}:${event.author.id}"
        val locale = FoxyLocale(parsedLocale[event.guild.locale] ?: "en-us")

        if (guildInfo.antiRaidModule.isEnabled) {
            val currentTimestamp = System.currentTimeMillis()
            val timestamps = messageCache.get(userId) { mutableListOf() }
            val messageThreshold = guildInfo.antiRaidModule.messagesThreshold
            val channelId = guildInfo.antiRaidModule.alertChannel ?: return
            val action = guildInfo.antiRaidModule.action
            if (event.guild.ownerId == event.author.id || !event.isFromGuild) return
            if (guildInfo.antiRaidModule.whitelistedChannels.contains(event.channel.id)) return
            if (event.member?.roles?.any { guildInfo.antiRaidModule.whitelistedRoles.contains(it.id) } == true) return

            timestamps.add(currentTimestamp)

            if ((timestamps?.size ?: 0) > messageThreshold) {
                sendWarningToAChannel(event.author.id, channelId) {
                    embed {
                        title = pretty(FoxyEmotes.FoxyRage, locale["antiraid.title"])
                        description = locale["antiraid.tooFastMessages", event.author.asMention, event.author.id]
                        color = Colors.RED
                        thumbnail = event.author.avatarUrl
                        field {
                            name = pretty(FoxyEmotes.FoxyDrinkingCoffee, locale["antiraid.fields.user"])
                            value = "${event.author.name} (`${event.author.id}`)"
                            inline = false
                        }

                        field {
                            name = pretty(FoxyEmotes.FoxyBan, locale["antiraid.fields.actionTaken"])
                            value = locale["antiraid.actions.$action"]
                            inline = false
                        }
                    }
                }

                try {
                    takeAnAction(
                        event.guild,
                        event.author,
                        action,
                        locale["antiraid.reasons.userIsSendingMessagesTooFast"],
                        guildInfo
                    )
                } catch (e: Exception) {
                    logger.warn { "Can't take an action for user $userId on ${event.guild.id}! Error: ${e.message}" }
                }
            }
        }
    }

    private suspend fun sendWarningToAChannel(targetId: String, channelId: String, block: InlineMessage<*>.() -> Unit) {
        if (alertsSent.getIfPresent(targetId) != null) return
        alertsSent.put(targetId, Unit)

        val channel = instance.jda.getTextChannelById(channelId) ?: return
        val msg = MessageCreateBuilder {
            apply(block)
        }

        channel.sendMessage(msg.build()).await()
    }

    private fun takeAnAction(
        guild: Guild,
        user: User,
        action: String,
        message: String,
        guildInfo: net.cakeyfox.serializable.database.data.Guild
    ) {
        when (action) {
            "TIMEOUT" -> {
                guild.timeoutFor(
                    user,
                    guildInfo.antiRaidModule.timeoutDuration,
                    TimeUnit.MILLISECONDS
                ).queue()
            }

            "KICK" -> {
                guild.kick(user).reason(message).queue()
            }

            "BAN" -> {
                guild.ban(
                    user,
                    0,
                    TimeUnit.SECONDS
                ).reason(message).queue()
            }

            else -> throw IllegalArgumentException("Invalid action type! Received $action")
        }
    }
}