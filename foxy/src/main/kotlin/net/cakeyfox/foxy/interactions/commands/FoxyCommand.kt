package net.cakeyfox.foxy.interactions.commands

data class FoxyCommand(
    val executor: UnleashedCommandExecutor?,
    val command: FoxyCommandDeclarationBuilder
)

