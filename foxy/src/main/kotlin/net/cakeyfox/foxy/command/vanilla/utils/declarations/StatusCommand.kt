package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.StatusExecutor

class StatusCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        name = "status",
        description = "status.description",
        isPrivate = false,
        category = "dev"
    ) {
        executor = StatusExecutor()
    }
}