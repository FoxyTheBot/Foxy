package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.YouTubeAddChannelExecutor
import net.cakeyfox.foxy.interactions.vanilla.utils.YouTubeRemoveChannelExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType

class YouTubeCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("youtube", CommandCategory.UTILS) {
        subCommand("add_channel") {
            addOption(opt(OptionType.STRING, "youtube_channel", true))
            addOption(opt(OptionType.CHANNEL, "text_channel", true))
            addOption(opt(OptionType.STRING, "message", false))
            availableForEarlyAccess = true

            executor = YouTubeAddChannelExecutor()
        }

        subCommand("remove_channel") {
            addOption(opt(OptionType.STRING, "youtube_channel", true))
            availableForEarlyAccess = true

            executor = YouTubeRemoveChannelExecutor()
        }
    }
}