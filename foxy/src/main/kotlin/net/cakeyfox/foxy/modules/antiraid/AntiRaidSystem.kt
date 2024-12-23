package net.cakeyfox.foxy.modules.antiraid

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
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

    suspend fun handleJoin(event: GuildMemberJoinEvent) {
        val guildId = event.guild.idLong
        val guildInfo = instance.mongoClient.utils.guild.getGuild(event.guild.id)

        if (guildInfo.antiRaidModule.handleJoin) {
            val currentTimestamp = System.currentTimeMillis()
            val timestamps = joinCache.get(guildId.toString()) { mutableListOf() }
            val joinThreshold = guildInfo.antiRaidModule.newUsersThreshold
            val channelId = guildInfo.antiRaidModule.alertChannel ?: return

            timestamps.add(currentTimestamp)

            if ((timestamps?.size ?: 0) > joinThreshold) {
                sendWarningToAChannel(event.user.id, channelId) {
                    embed {
                        title = "Sistema Anti-Raid"
                        description = "Muitos membros estão entrando no servidor em um curto período de tempo."
                    }
                }
            }
        }
    }

    suspend fun handleMessage(event: MessageReceivedEvent) {
        val guildInfo = instance.mongoClient.utils.guild.getGuild(event.guild.id)
        val userId = "${event.guild.id}:${event.author.id}"

        if (guildInfo.antiRaidModule.isEnabled) {
            val currentTimestamp = System.currentTimeMillis()
            val timestamps = messageCache.get(userId) { mutableListOf() }
            val messageThreshold = guildInfo.antiRaidModule.messagesThreshold
            val channelId = guildInfo.antiRaidModule.alertChannel ?: return
            if (event.guild.ownerId == event.author.id || !event.isFromGuild) return

            timestamps.add(currentTimestamp)

            if ((timestamps?.size ?: 0) > messageThreshold) {
                sendWarningToAChannel(event.author.id, channelId) {
                    embed {
                        title = "Sistema Anti-Raid"
                        description = "O usuário ${event.author.asMention} está enviando mensagens muito rápido."
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
                           event.guild.kick(event.author).reason("Anti-Raid: Mensagens em excesso").queue()
                       }

                       "BAN" -> {
                           event.guild.ban(
                               event.author,
                               guildInfo.antiRaidModule.banDuration,
                               TimeUnit.DAYS
                           ).reason("Anti-Raid: Mensagens em excesso").queue()
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