package net.cakeyfox.foxy.interactions.vanilla.youtube.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.youtube.YouTubeAddChannelExecutor
import net.cakeyfox.foxy.interactions.vanilla.youtube.YouTubeListChannelsExecutor
import net.cakeyfox.foxy.interactions.vanilla.youtube.YouTubeRemoveChannelExecutor
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.commands.OptionType

class YouTubeCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("youtube", CommandCategory.YOUTUBE) {
        subCommand("add_channel") {
            addOption(opt(OptionType.STRING, "youtube_channel", true))
            addOption(opt(OptionType.CHANNEL, "text_channel", true))
            addOption(opt(OptionType.STRING, "message", false))
            availableForEarlyAccess = false
            addPermission(Permission.MANAGE_SERVER)

            executor = YouTubeAddChannelExecutor()
        }

        subCommand("remove_channel") {
            addOption(opt(OptionType.STRING, "youtube_channel", true))
            availableForEarlyAccess = false
            addPermission(Permission.MANAGE_SERVER)

            executor = YouTubeRemoveChannelExecutor()
        }

        subCommand("view_channels") {
            availableForEarlyAccess = false
            addPermission(Permission.MANAGE_SERVER)

            executor = YouTubeListChannelsExecutor()
        }
    }
}