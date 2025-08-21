package net.cakeyfox.foxy.interactions.commands

import net.cakeyfox.foxy.interactions.commands.CommandContext

abstract class UnleashedCommandExecutor {
    abstract suspend fun execute(context: CommandContext)
}