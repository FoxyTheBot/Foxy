package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.HelpExecutor

class HelpCommand : FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "help",
        "help.description"
    ) {
        executor = HelpExecutor()
    }
}