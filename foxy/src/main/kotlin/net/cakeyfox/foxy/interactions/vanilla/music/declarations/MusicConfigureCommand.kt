package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.MusicConfigureExecutor
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions

class MusicConfigureCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("music", CommandCategory.MUSIC) {
        this.defaultMemberPermissions = DefaultMemberPermissions.enabledFor(Permission.MANAGE_SERVER)

        subCommand("configure") {
            executor = MusicConfigureExecutor()
        }
    }
}