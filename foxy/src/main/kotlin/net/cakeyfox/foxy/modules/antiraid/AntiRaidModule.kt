package net.cakeyfox.foxy.modules.antiraid

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import kotlinx.coroutines.delay
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.antiraid.utils.AntiRaidActions
import net.cakeyfox.foxy.modules.antiraid.utils.WarningBuilder
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.interactions.DiscordLocale
import java.util.concurrent.TimeUnit
import kotlin.reflect.jvm.jvmName

class AntiRaidModule(
    val foxy: FoxyInstance
) {
    companion object {
        private val logger = KotlinLogging.logger(this::class.jvmName)
    }

    private val joinCache: Cache<String, MutableList<Long>> = Caffeine.newBuilder()
        .expireAfterWrite(10, TimeUnit.SECONDS)
        .build()

    private val messageCache: Cache<String, MutableList<Long>> = Caffeine.newBuilder()
        .expireAfterWrite(5, TimeUnit.SECONDS)
        .build()

    // Will store the alerts to avoid alert spam
    private val alertsSent: Cache<String, Unit> = Caffeine.newBuilder()
        .expireAfterWrite(2, TimeUnit.SECONDS)
        .build()

    private val userAlertsSent: Cache<String, Unit> = Caffeine.newBuilder()
        .expireAfterWrite(5, TimeUnit.SECONDS)
        .build()

    private val parsedLocale = hashMapOf(
        DiscordLocale.PORTUGUESE_BRAZILIAN to "pt-br",
        DiscordLocale.ENGLISH_US to "en-us",
    )

    // Handling mass joins
    suspend fun handleJoin(event: GuildMemberJoinEvent) {
        val guildId = event.guild.idLong
        val guildInfo = foxy.mongoClient.utils.guild.getGuild(event.guild.id)
        val locale = FoxyLocale(parsedLocale[event.guild.locale] ?: "en-us")

        if (guildInfo.antiRaidModule.handleMultipleJoins) {
            val currentTimestamp = System.currentTimeMillis()
            val timestamps = joinCache.get(guildId.toString()) { mutableListOf() }
            val userId = event.user.id
            val antiRaidSettings = guildInfo.antiRaidModule


            timestamps.add(currentTimestamp)

            if ((timestamps?.size ?: 0) > antiRaidSettings.newUsersThreshold) {
                try {
                    takeAnAction(
                        event.guild,
                        event.user,
                        antiRaidSettings.actionForMassJoin,
                        locale["antiraid.reasons.userIsSendingMessagesTooFast"],
                        guildInfo
                    )

                    sendWarningToAChannel(
                        userId, antiRaidSettings.alertChannel ?: return,
                        user = event.user,
                        locale = locale
                    ) {
                        content = locale["antiraid.membersJoiningTooQuickly"]
                        actionTaken = antiRaidSettings.actionForMassJoin
                    }

                } catch (e: Exception) {
                    logger.warn { "Can't take an action for user $userId on ${event.guild.id}! Error: ${e.message}" }
                }
            }
        }
    }

    // Handling mass messages
    suspend fun handleMessage(event: MessageReceivedEvent) {
        val guildInfo = foxy.mongoClient.utils.guild.getGuild(event.guild.id)
        val userId = "${event.guild.id}:${event.author.id}"
        val locale = FoxyLocale(parsedLocale[event.guild.locale] ?: "en-us")
        val currentTimestamp = System.currentTimeMillis()
        val timestamps = messageCache.get(userId) { mutableListOf() }
        val antiRaidSettings = guildInfo.antiRaidModule

        if (guildInfo.antiRaidModule.handleMultipleMessages) {
            if (event.guild.ownerId == event.author.id || !event.isFromGuild) return
            if (antiRaidSettings.whitelistedChannels.contains(event.channel.id)) return
            if (event.member?.roles?.any { antiRaidSettings.whitelistedRoles.contains(it.id) } == true) return

            // This is for mass message
            timestamps.add(currentTimestamp)

            if ((timestamps?.size ?: 0) > antiRaidSettings.messagesThreshold) {
                try {
                    takeAnAction(
                        event.guild,
                        event.author,
                        antiRaidSettings.actionForMassMessage,
                        locale["antiraid.reasons.userIsSendingMessagesTooFast"],
                        guildInfo
                    )


                    sendWarningToAChannel(
                        event.author.id,
                        antiRaidSettings.alertChannel ?: return,
                        user = event.author,
                        locale = locale
                    ) {
                        content = locale["antiraid.tooFastMessages", event.author.asMention, event.author.id]
                        actionTaken = antiRaidSettings.actionForMassMessage
                    }

                } catch (e: Exception) {
                    logger.warn { "Can't take an action for user $userId on ${event.guild.id}! Error: ${e.message}" }
                }
            }


            if (hasExcessiveRepeatedSequences(event.message.contentRaw, antiRaidSettings.repeatedCharsThreshold)) {
                return try {
                    takeAnAction(
                        event.guild,
                        event.author,
                        guildInfo.antiRaidModule.actionForMassChars,
                        locale["antiraid.userIsSendingRepeatedSequences", event.author.asMention],
                        guildInfo,
                        event
                    )
                } catch (e: Exception) {
                    logger.warn { "Can't take an action for user $userId on ${event.guild.id}! Error: ${e.message}" }
                }
            }
        }
    }

    // Let's take an action!
    private suspend fun takeAnAction(
        guild: Guild,
        user: User,
        action: String,
        message: String,
        guildInfo: net.cakeyfox.serializable.database.data.Guild,
        event: MessageReceivedEvent? = null
    ) {
        try {
            when (action) {
                AntiRaidActions.Timeout -> {
                    if (guild.selfMember.hasPermission(Permission.MODERATE_MEMBERS)) {
                        guild.timeoutFor(
                            user,
                            guildInfo.antiRaidModule.timeoutDuration,
                            TimeUnit.MILLISECONDS
                        ).queue()
                    } else return
                }

                AntiRaidActions.Kick -> {
                    if (guild.selfMember.hasPermission(Permission.KICK_MEMBERS)) {
                        guild.kick(user).reason(message).queue()
                    } else return
                }

                AntiRaidActions.Ban -> {
                    if (guild.selfMember.hasPermission(Permission.BAN_MEMBERS)) {
                        guild.ban(
                            user,
                            0,
                            TimeUnit.SECONDS
                        ).reason(message).queue()
                    } else return
                }

                AntiRaidActions.WarnUser -> {
                    if (event != null) {
                        if (guild.selfMember.hasPermission(Permission.MESSAGE_MANAGE)) {
                            event.message.delete().reason(message).queue()
                            sendAlertToUser(event.channel.id, event.author.id) {
                                content = pretty(
                                    FoxyEmotes.FoxyRage,
                                    message
                                )
                            }
                        }
                    }
                }

                AntiRaidActions.DoNothing -> {
                    return
                }

                else -> throw IllegalArgumentException("Invalid action type! Received $action")
            }
        } catch (e: Exception) {
            logger.warn { "Can't take an action for user ${user.id}! Missing permissions?" }
        }
    }

    private fun hasExcessiveRepeatedSequences(message: String, limit: Int): Boolean {
        if (message.isBlank()) return false

        val normalizedMessage = message.trim().lowercase()

        var charRepetitionCount = 1
        var maxCharRepetition = 1
        for (i in 1 until normalizedMessage.length) {
            if (normalizedMessage[i] == normalizedMessage[i - 1]) {
                charRepetitionCount++
                maxCharRepetition = maxOf(maxCharRepetition, charRepetitionCount)
            } else {
                charRepetitionCount = 1
            }
        }

        if (maxCharRepetition > limit) {
            return true
        }

        val words = normalizedMessage.split("\\s+".toRegex())
        val wordFrequency = mutableMapOf<String, Int>()

        for (word in words) {
            val condensedWord = word.replace(Regex("(.)\\1+"), "$1")
            wordFrequency[condensedWord] = wordFrequency.getOrDefault(condensedWord, 0) + 1
            if (wordFrequency[condensedWord]!! > limit) {
                return true
            }
        }

        for (patternLength in 1..(normalizedMessage.length / 2)) {
            val pattern = normalizedMessage.substring(0, patternLength)
            val repeatedPattern = pattern.repeat(limit + 1)
            if (normalizedMessage.startsWith(repeatedPattern)) {
                return true
            }
        }

        return false
    }

    private suspend fun sendWarningToAChannel(
        targetId: String,
        channelId: String,
        user: User,
        locale: FoxyLocale,
        block: WarningBuilder.() -> Unit
    ) {
        if (alertsSent.getIfPresent(targetId) != null) return
        alertsSent.put(targetId, Unit)
        val message = WarningBuilder().apply(block)

        val channel = foxy.jda.getTextChannelById(channelId) ?: return
        val msg = MessageCreateBuilder {
            embed {
                title = pretty(
                    FoxyEmotes.FoxyRage,
                    locale["antiraid.title"]
                )
                description = message.content
                color = Colors.RED
                thumbnail = user.avatarUrl
                field {
                    name = pretty(FoxyEmotes.FoxyDrinkingCoffee, locale["antiraid.fields.user"])
                    value = "${user.name} (`${user.id}`)"
                    inline = false
                }

                field {
                    name = pretty(FoxyEmotes.FoxyBan, locale["antiraid.fields.actionTaken"])
                    value = locale["antiraid.actions.${message.actionTaken}"]
                    inline = false
                }
            }
        }

        channel.sendMessage(msg.build()).await()
    }

    private suspend fun sendAlertToUser(channelId: String, userId: String, block: InlineMessage<*>.() -> Unit) {
        if (userAlertsSent.getIfPresent(userId) != null) return
        userAlertsSent.put(userId, Unit)
        val channel = foxy.jda.getTextChannelById(channelId) ?: return
        val msg = MessageCreateBuilder {
            apply(block)
        }
        val message = channel.sendMessage(msg.build()).await()
        delay(5000)
        message.delete().queue()
    }
}