package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.RussianRouletteExecutor

class RussianRouletteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "russian-roulette",
        "russian-roulette.description",
        category = CommandCategory.FUN,
        ) {
        executor = RussianRouletteExecutor()
    }
}