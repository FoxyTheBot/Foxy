package net.cakeyfox.foxy.command.vanilla.economy.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.DailyExecutor

class DailyCommand: FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "daily",
        "daily.description",
        block = {
            executor = DailyExecutor()
        }
    )
}