package net.cakeyfox.foxy.modules

import com.github.benmanes.caffeine.cache.Caffeine
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.events.guild.voice.GuildVoiceUpdateEvent
import net.dv8tion.jda.api.events.message.MessageDeleteEvent
import net.dv8tion.jda.api.events.message.MessageUpdateEvent
import java.util.concurrent.TimeUnit

class ServerLogModule(
    private val foxy: FoxyInstance
) {
    data class CustomMember(val member: Member?, val message: Message)

    val cachedMessages = Caffeine.newBuilder()
        .expireAfterWrite(1, TimeUnit.DAYS)
        .maximumSize(1000)
        .build<Long, CustomMember>()

    suspend fun processGuildVoiceUpdate(event: GuildVoiceUpdateEvent) {
        val isConnected = event.channelJoined
        val channelToSend = foxy.database.guild.getGuild(event.guild.id).serverLogModule?.channelToSendLogs ?: return

        if (isConnected != null) {
            foxy.utils.sendMessageToAGuildFromThisCluster(event.guild, channelToSend) {
                embed {
                    thumbnail = event.member.effectiveAvatarUrl
                    color = Colors.BLUE
                    description =
                        "${event.member.effectiveName} (${event.member.id}) Entrou no canal de voz ${event.channelJoined?.asMention}"
                }
            }
        } else {
            foxy.utils.sendMessageToAGuildFromThisCluster(event.guild, channelToSend) {
                embed {
                    thumbnail = event.member.effectiveAvatarUrl
                    color = Colors.BLUE
                    description =
                        "${event.member.effectiveName} (${event.member.id}) Saiu do canal de voz ${event.channelLeft?.asMention}"
                }
            }
        }
    }

    suspend fun processUpdatedMessage(event: MessageUpdateEvent) {
        val oldMessageContent = cachedMessages.getIfPresent(event.messageIdLong) ?: return
        val channelToSend = foxy.database.guild.getGuild(event.guild.id).serverLogModule?.channelToSendLogs ?: return
        val customMember = CustomMember(
            message = event.message,
            member = event.member
        )

        // Replace the old message with the new message
        cachedMessages.put(event.messageIdLong, customMember)

        foxy.utils.sendMessageToAGuildFromThisCluster(event.guild, channelToSend) {
            embed {
                thumbnail = oldMessageContent.member?.effectiveAvatarUrl ?: Constants.DISCORD_DEFAULT_AVATAR
                color = Colors.BLUE
                title = "Uma mensagem foi alterada"
                field("Canal de Texto:", event.channel.asMention)
                field(
                    "Mensagem Original",
                    "```${oldMessageContent.message.contentRaw}```",
                    false
                )
                field(
                    "Nova Mensagem",
                    "```${event.message.contentRaw}```",
                    false
                )
                if (oldMessageContent.message.attachments.isNotEmpty()) {
                    val assets = oldMessageContent.message.attachments.map { it.url }
                    field("Anexos", assets.joinToString("\n"), false)
                }

                footer("ID da Mensagem: ${event.messageId}")
            }
        }
    }

    suspend fun processMessageDeleted(event: MessageDeleteEvent) {
        val messageContent = cachedMessages.getIfPresent(event.messageIdLong) ?: return
        val channelToSend = foxy.database.guild.getGuild(event.guild.id).serverLogModule?.channelToSendLogs ?: return

        foxy.utils.sendMessageToAGuildFromThisCluster(event.guild, channelToSend) {
            embed {
                color = Colors.RED
                title = "Uma mensagem foi deletada"
                thumbnail = messageContent.member!!.effectiveAvatarUrl

                if (messageContent.message.contentRaw.isNotEmpty()) {
                    field("Conteúdo da Mensagem:", "```${messageContent.message.contentRaw}```", false)
                }

                if (messageContent.message.attachments.isNotEmpty()) {
                    val assets = messageContent.message.attachments.map { it.url }
                    field("Anexos", assets.joinToString("\n"), false)
                }

                footer("ID da Mensagem: ${event.messageId}")
            }
        }

        cachedMessages.invalidate(event.messageIdLong)
    }
}