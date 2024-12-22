package net.cakeyfox.foxy.command.structure

import net.cakeyfox.foxy.command.FoxyInteractionContext

abstract class FoxyCommandExecutor {
    abstract suspend fun execute(context: FoxyInteractionContext)
}