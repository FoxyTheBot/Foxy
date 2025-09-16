package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.SkipExecutor

class SkipCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("skip", CommandCategory.MUSIC) {
        supportsLegacy = true
        aliases = listOf("pular")
        executor = SkipExecutor()
    }
}