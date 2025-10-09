package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.MusicConfigureExecutor

class MusicConfigureCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("music", CommandCategory.MUSIC) {
        subCommand("configure") {
            executor = MusicConfigureExecutor()
        }
    }
}