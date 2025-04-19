package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.RussianRouletteExecutor

class RussianRouletteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "russian-roulette",
        "russian-roulette.description",
        category = "fun",
        ) {
        executor = RussianRouletteExecutor()
    }
}