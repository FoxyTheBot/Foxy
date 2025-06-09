package net.cakeyfox.foxy.interactions.commands

import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

interface FoxyCommandDeclarationWrapper {
    fun create(): FoxyCommandDeclarationBuilder

    @Deprecated("Use slashCommand instead | Check https://github.com/FoxyTheBot/Foxy/issues/167")
    fun command(
        name: String,
        description: String,
        isPrivate: Boolean = false,
        availableForEarlyAccess: Boolean = false,
        category: String,
        integrationType: List<IntegrationType> = listOf(IntegrationType.GUILD_INSTALL),
        interactionContexts: List<InteractionContextType> = listOf(InteractionContextType.GUILD),
        block: FoxyCommandDeclarationBuilder.() -> Unit
    ): FoxyCommandDeclarationBuilder {
        return FoxyCommandDeclarationBuilder(
            name,
            description,
            isPrivate,
            category,
            availableForEarlyAccess,
            integrationType,
            interactionContexts
        ).apply(block)
    }

    fun slashCommand(
        name: String,
        category: String,
        block: FoxyCommandDeclarationBuilder.() -> Unit
    ): FoxyCommandDeclarationBuilder {
        return FoxyCommandDeclarationBuilder(
            name,
            description = "placeholderDescription",
            isPrivate = false,
            category = category,
            availableForEarlyAccess = false,
            integrationType = listOf(IntegrationType.GUILD_INSTALL),
            interactionContexts = listOf(InteractionContextType.GUILD)
        ).apply(block)
    }
}