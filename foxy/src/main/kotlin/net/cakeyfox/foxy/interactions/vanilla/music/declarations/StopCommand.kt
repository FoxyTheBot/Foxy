package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.StopExecutor

class StopCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("stop", CommandCategory.MUSIC) {
        enableLegacyMessageSupport = true
        aliases = listOf("parar")
        executor = StopExecutor()
    }
}