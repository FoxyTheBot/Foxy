package net.cakeyfox.foxy.modules.welcomer

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.welcomer.utils.WelcomerWrapper
import net.cakeyfox.foxy.modules.welcomer.utils.WelcomerJSONParser
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent

class WelcomerManager(
    val foxy: FoxyInstance
) : WelcomerWrapper {
    private val welcomer = WelcomerJSONParser()
    private val scope = CoroutineScope(Dispatchers.IO)

    override fun onGuildJoin(event: GuildMemberJoinEvent) {
        scope.launch {
            val guildData = foxy.mongoClient.utils.guild.getGuild(event.guild.id)

            if (guildData.GuildJoinLeaveModule.isEnabled) {
                val placeholders = welcomer.getPlaceholders(event.guild, event.user)
                val rawMessage = guildData.GuildJoinLeaveModule.joinMessage ?: return@launch

                val (content, embeds) = welcomer.parseDiscordJsonMessage(rawMessage, placeholders)

                val channel = event.guild.getTextChannelById(guildData.GuildJoinLeaveModule.joinChannel ?: "0")
                    ?: return@launch

                channel.sendMessage(content).setEmbeds(embeds).queue()

            }
        }
    }

    override fun onGuildLeave(event: GuildMemberRemoveEvent) {
        scope.launch {
            val guildData = foxy.mongoClient.utils.guild.getGuild(event.guild.id)

            if (guildData.GuildJoinLeaveModule.alertWhenUserLeaves) {
                val placeholders = welcomer.getPlaceholders(event.guild, event.user)
                val rawMessage = guildData.GuildJoinLeaveModule.leaveMessage ?: return@launch

                val (content, embeds) = welcomer.parseDiscordJsonMessage(rawMessage, placeholders)

                val channel = event.guild.getTextChannelById(guildData.GuildJoinLeaveModule.leaveChannel ?: "0")
                    ?: return@launch

                channel.sendMessage(content).setEmbeds(embeds).queue()
            }
        }
    }
}