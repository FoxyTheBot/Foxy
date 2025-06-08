package net.cakeyfox.foxy.interactions.commands

import net.cakeyfox.foxy.interactions.FoxyInteractionContext

abstract class CommandExecutor {
    abstract suspend fun execute(context: FoxyInteractionContext)
}