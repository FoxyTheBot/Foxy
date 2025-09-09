package net.cakeyfox.foxy.interactions.vanilla.youtube.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.youtube.YouTubeManageChannelsExecutor
import net.dv8tion.jda.api.Permission

class YouTubeCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("youtube", CommandCategory.YOUTUBE) {
        subCommand("view_channels") {
            availableForEarlyAccess = false
            addPermission(Permission.MANAGE_SERVER)

            executor = YouTubeManageChannelsExecutor()
        }
    }
}