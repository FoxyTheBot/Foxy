package net.cakeyfox.foxy.command.structure

import net.cakeyfox.foxy.command.UnleashedCommandContext

abstract class FoxySlashCommandExecutor {
    abstract suspend fun execute(context: UnleashedCommandContext)
}