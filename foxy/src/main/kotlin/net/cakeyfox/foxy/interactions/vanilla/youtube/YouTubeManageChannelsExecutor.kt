package net.cakeyfox.foxy.interactions.vanilla.youtube

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.interactions.vanilla.youtube.utils.YouTubeInteractionHandler.fetchFollowedChannelsWithInfo
import net.cakeyfox.foxy.interactions.vanilla.youtube.utils.YouTubeInteractionHandler.renderFollowedChannelsList
import net.cakeyfox.foxy.utils.PremiumUtils
import net.dv8tion.jda.api.Permission

class YouTubeManageChannelsExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()

        if (context.member?.hasPermission(Permission.MANAGE_SERVER) == false) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["youDontHavePermissionToDoThat"])
            }

            return
        }

        val followedChannelsWithInfo = fetchFollowedChannelsWithInfo(context)
        val maxChannelsAvailable = PremiumUtils.maximumYouTubeChannels(context)

        context.reply {
            useComponentsV2 = true
            renderFollowedChannelsList(context, followedChannelsWithInfo, maxChannelsAvailable)
        }
    }
}