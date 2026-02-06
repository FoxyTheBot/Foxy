package net.cakeyfox.foxy.interactions.commands

import net.dv8tion.jda.api.interactions.commands.Command

data class ContextMenuConfig(
    val type: Command.Type,
    val name: String,
    val executor: UnleashedCommandExecutor? = null
)