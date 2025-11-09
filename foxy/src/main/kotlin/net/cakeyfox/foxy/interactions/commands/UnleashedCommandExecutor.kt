package net.cakeyfox.foxy.interactions.commands

abstract class UnleashedCommandExecutor {
    abstract suspend fun execute(context: CommandContext)
}