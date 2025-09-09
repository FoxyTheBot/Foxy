package net.cakeyfox.foxy.interactions.commands

data class FoxyCommandUnleashed(
    val executor: UnleashedCommandExecutor?,
    val command: FoxyCommandDeclarationBuilder
)

