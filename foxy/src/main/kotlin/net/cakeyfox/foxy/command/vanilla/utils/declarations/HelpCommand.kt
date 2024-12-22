package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.HelpExecutor

class HelpCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "help",
        "help.description"
    ) {
        executor = HelpExecutor()
    }
}