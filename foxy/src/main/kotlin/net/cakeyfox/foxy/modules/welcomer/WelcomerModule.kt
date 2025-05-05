package net.cakeyfox.foxy.modules.welcomer

import mu.KotlinLogging
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.welcomer.utils.WelcomerJSONParser
import net.cakeyfox.foxy.utils.PlaceholderUtils
import net.cakeyfox.foxy.utils.pretty
import net.cakeyfox.foxy.database.data.Guild
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent

class WelcomerModule(
    val foxy: FoxyInstance
) {
    companion object {
        private val logger = KotlinLogging.logger { }
        private val getAllPlaceholders = PlaceholderUtils::getAllPlaceholders
    }

    private val welcomer = WelcomerJSONParser()

    suspend fun onGuildJoin(event: GuildMemberJoinEvent) {
        val guildData = foxy.database.guild.getGuild(event.guild.id)

        if (guildData.GuildJoinLeaveModule.isEnabled) {
            val placeholders = getAllPlaceholders(event.guild, event.user)
            val rawMessage = guildData.GuildJoinLeaveModule.joinMessage ?: return

            val (content, embeds) = welcomer.getMessageFromJson(rawMessage, placeholders)

            if (guildData.GuildJoinLeaveModule.sendDmWelcomeMessage) sendDmMessage(event, guildData, placeholders)

            val channel = event.guild.getTextChannelById(guildData.GuildJoinLeaveModule.joinChannel ?: "0")
                ?: return

            if (channel.canTalk() && event.guild.selfMember.hasPermission(Permission.MESSAGE_SEND)) {
                channel.sendMessage(content).setEmbeds(embeds).queue()
            }
        }
    }

    suspend fun onGuildLeave(event: GuildMemberRemoveEvent) {
        val guildData = foxy.database.guild.getGuild(event.guild.id)

        if (guildData.GuildJoinLeaveModule.alertWhenUserLeaves) {
            val placeholders = getAllPlaceholders(event.guild, event.user)
            val rawMessage = guildData.GuildJoinLeaveModule.leaveMessage ?: return

            val (content, embeds) = welcomer.getMessageFromJson(
                rawMessage,
                placeholders
            )

            val channel = event.guild.getTextChannelById(guildData.GuildJoinLeaveModule.leaveChannel ?: "0")
                ?: return

            if (channel.canTalk() && event.guild.selfMember.hasPermission(Permission.MESSAGE_SEND)) {
                channel.sendMessage(content).setEmbeds(embeds).queue()
            }
        }
    }

    private fun sendDmMessage(event: GuildMemberJoinEvent, guildData: Guild, placeholders: Map<String, String?>) {
        val rawDmMessage = guildData.GuildJoinLeaveModule.dmWelcomeMessage ?: return
        val (dmContent, dmEmbeds) = welcomer.getMessageFromJson(rawDmMessage, placeholders)
        val formattedContent = """
            > ${
            pretty(
                FoxyEmotes.FoxyCake,
                "**Mensagem enviada pelo servidor: ${event.guild.name} `(${event.guild.id})`**"
            )
        }
            
            $dmContent
        """.trimIndent()

        try {
            event.user.openPrivateChannel().queue { channel ->
                if (channel.canTalk()) { // In this case, will check if user is a bot
                    try {
                        channel
                            .sendMessage(formattedContent)
                            .setEmbeds(dmEmbeds)
                            .queue()
                        logger.debug { "Sent welcome message to ${event.user.name} (${event.user.id})" }
                    } catch (e: Exception) {
                        logger.warn { "Can't DM ${event.user.name} (${event.user.id})! Maybe closed?" }
                    }
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "Failed to open private channel with ${event.user.name} (${event.user.id})" }
        }
    }
}