package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.Permission

class YouTubeRemoveChannelExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val youtubeChannel = context.getOption("youtube_channel", type = String::class.java)!!

        if (context.member?.hasPermission(Permission.MANAGE_SERVER) == false) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["youDontHavePermissionToDoThat"])
            }

            return
        }

        val channelInfo = context.foxy.youtubeManager.getChannelInfo(youtubeChannel)?.items?.get(0) ?: return
        val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
        val isChannelAdded = guildData.followedYouTubeChannels.any { it.channelId == channelInfo.id }

        if (isChannelAdded) {
            context.foxy.database.youtube.removeChannelFromGuild(context.guildId!!, channelInfo.id)
            context.reply {
                content = pretty(FoxyEmotes.FoxyOk, context.locale["youtube.channel.remove.channelRemoved", channelInfo.snippet.title])
            }
        } else {
            context.reply {
                content = pretty(FoxyEmotes.FoxyDrinkingCoffee, context.locale["youtube.channel.remove.unknownChannel", channelInfo.snippet.title])
            }
            return
        }
    }
}