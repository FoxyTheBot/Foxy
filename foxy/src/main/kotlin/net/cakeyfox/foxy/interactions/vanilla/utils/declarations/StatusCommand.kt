package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.StatusExecutor

class StatusCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        name = "status",
        description = "status.description",
        category = CommandCategory.UTILS
    ) {
        executor = StatusExecutor()
    }
}