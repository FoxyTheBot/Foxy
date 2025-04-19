package net.cakeyfox.foxy.command.vanilla.dev.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.dev.StatusExecutor

class StatusCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        name = "status",
        description = "status.description",
        isPrivate = true
    ) {
        executor = StatusExecutor()
    }
}