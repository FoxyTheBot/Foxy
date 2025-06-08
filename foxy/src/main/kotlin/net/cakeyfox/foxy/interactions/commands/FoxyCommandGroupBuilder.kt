package net.cakeyfox.foxy.interactions.commands

import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class FoxyCommandGroupBuilder(
    val name: String,
    val description: String
) {
    val subCommands = mutableListOf<FoxyCommandDeclarationBuilder>()

    fun subCommand(
        name: String,
        description: String,
        isPrivate: Boolean = false,
        category: String,
        availableForEarlyAccess: Boolean = false,
        integrationType: List<IntegrationType> = listOf(IntegrationType.GUILD_INSTALL),
        interactionContexts: List<InteractionContextType> = listOf(InteractionContextType.GUILD),
        block: FoxyCommandDeclarationBuilder.() -> Unit
    ) {
        val subCommand = FoxyCommandDeclarationBuilder(
            name,
            description,
            isPrivate,
            category,
            availableForEarlyAccess,
            integrationType,
            interactionContexts
        )
        subCommand.block()
        subCommands.add(subCommand)
    }

    fun getSubCommand(name: String): FoxyCommandDeclarationBuilder? {
        return subCommands.find { it.name == name }
    }
}