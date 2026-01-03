package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.PauseExecutor

class PauseCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("pause", CommandCategory.MUSIC) {
        enableLegacyMessageSupport = true
        aliases = mutableListOf("pausar")

        executor = PauseExecutor()
    }
}