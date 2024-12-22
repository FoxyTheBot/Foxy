package net.cakeyfox.foxy.command.vanilla.economy.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.DailyExecutor

class DailyCommand: FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "daily",
        "daily.description",
        block = {
            executor = DailyExecutor()
        }
    )
}