package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class YouTubeListChannelsExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()

        val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
        val followedChannels = guildData.followedYouTubeChannels

        if (followedChannels.isEmpty()) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["youtube.channel.list.noChannel"]
                )
            }
            return
        }

        val channelDescriptions = mutableListOf<String>()
        for (channel in followedChannels) {
            val channelInfo = context.foxy.youtubeManager
                .getChannelInfo(channel.channelId)
                ?.items?.getOrNull(0)

            if (channelInfo != null) {
                val message = channel.notificationMessage
                    ?.replace("{channel.name}", channelInfo.snippet.title)
                    ?.replace("{video.url}", "https://www.youtube.com/watch?v=fSeFxzeo5Ts")
                    ?: context.locale["youtube.channel.add.undefined"]

                channelDescriptions.add(
                    "**${channelInfo.snippet.title}** (${channel.channelId})\n" +
                            "→ Notifica em <#${channel.channelToSend}>\n" +
                            "→ Mensagem: $message"
                )
            } else {
                channelDescriptions.add(
                    "❓ `ID: ${channel.channelId}` → <#${channel.channelId}>"
                )
            }
        }

        context.reply {
            embed {
                title = pretty(
                    FoxyEmotes.YouTube,
                    context.locale["youtube.channel.list.title"]
                )
                description = channelDescriptions.joinToString("\n\n")
                color = Colors.RED
            }
        }
    }
}
