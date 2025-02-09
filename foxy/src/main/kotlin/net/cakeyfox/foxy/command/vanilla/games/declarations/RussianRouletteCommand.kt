package net.cakeyfox.foxy.command.vanilla.games.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.games.RussianRouletteExecutor

class RussianRouletteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "russian-roulette",
        "russian-roulette.description"
    ) {
        executor = RussianRouletteExecutor()
    }
}