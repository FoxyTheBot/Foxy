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
        .expireAfterWrite(1, TimeUnit.HOURS)
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
                        title = pretty(FoxyEmotes.FOXY_RAGE, locale["antiraid.title"])
                        description = locale["antiraid.membersJoiningTooQuickly"]
                        color = Colors.RED
                        thumbnail = event.user.avatarUrl
                        field {
                            name = pretty(FoxyEmotes.FOXY_DRINKING_COFFEE, locale["antiraid.fields.user"])
                            value = "${event.user.name} (`${event.user.id}`)"
                            inline = false
                        }

                        field {
                            name = pretty(FoxyEmotes.FOXY_BAN, locale["antiraid.fields.actionTaken"])
                            value = locale["antiraid.actions.$action"]
                            inline = false
                        }
                    }
                }

                try {
                    when (guildInfo.antiRaidModule.actionForMassJoin) {
                        "BAN" -> {
                            event.guild.ban(
                                event.user,
                                0,
                                TimeUnit.SECONDS
                                ).reason(locale["antiraid.reasons.userIsSendingMessagesTooFast"])
                        }

                        "KICK" -> {
                            event.guild.kick(event.user)
                                .reason(locale["antiraid.reasons.userIsSendingMessagesTooFast"])
                        }

                        // Foxy will only warn the server staff if no action was configured
                        else -> return
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

            timestamps.add(currentTimestamp)

            if ((timestamps?.size ?: 0) > messageThreshold) {
                sendWarningToAChannel(event.author.id, channelId) {
                    embed {
                        title = pretty(FoxyEmotes.FOXY_RAGE, locale["antiraid.title"])
                        description = locale["antiraid.tooFastMessages", event.author.asMention, event.author.id]
                        color = Colors.RED
                        thumbnail = event.author.avatarUrl
                        field {
                            name = pretty(FoxyEmotes.FOXY_DRINKING_COFFEE, locale["antiraid.fields.user"])
                            value = "${event.author.name} (`${event.author.id}`)"
                            inline = false
                        }

                        field {
                            name = pretty(FoxyEmotes.FOXY_BAN, locale["antiraid.fields.actionTaken"])
                            value = locale["antiraid.actions.$action"]
                            inline = false
                        }
                    }
                }

               try {
                   when (guildInfo.antiRaidModule.action) {
                       "TIMEOUT" -> {
                           event.guild.timeoutFor(
                               event.author,
                               guildInfo.antiRaidModule.timeoutDuration,
                               TimeUnit.MILLISECONDS
                           ).queue()
                       }

                       "KICK" -> {
                           event.guild.kick(event.author).reason(
                               locale["antiraid.reasons.userIsSendingMessagesTooFast"]
                           ).queue()
                       }

                       "BAN" -> {
                           event.guild.ban(
                               event.author,
                               0,
                               TimeUnit.SECONDS
                           ).reason(
                               locale["antiraid.reasons.userIsSendingMessagesTooFast"]
                           ).queue()
                       }

                       else -> throw IllegalArgumentException("Invalid action type! Received ${guildInfo.antiRaidModule.action}")
                   }
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
}