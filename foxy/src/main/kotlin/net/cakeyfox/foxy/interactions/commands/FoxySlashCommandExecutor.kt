package net.cakeyfox.foxy.interactions.commands

import net.cakeyfox.foxy.interactions.FoxyInteractionContext

abstract class FoxySlashCommandExecutor {
    abstract suspend fun execute(context: FoxyInteractionContext)
}