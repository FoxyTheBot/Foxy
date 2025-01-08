package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationBuilder
import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.PingExecutor

class PingCommand : FoxyCommandDeclarationWrapper {
    override fun create(): FoxyCommandDeclarationBuilder = command(
        "ping",
        "ping.description",

        block = {
            executor = PingExecutor()
        }
    )
}