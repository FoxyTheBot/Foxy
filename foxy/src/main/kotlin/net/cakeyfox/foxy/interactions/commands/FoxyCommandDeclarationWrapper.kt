package net.cakeyfox.foxy.interactions.commands

import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

interface FoxyCommandDeclarationWrapper {
    fun create(): FoxyCommandDeclarationBuilder

    fun slashCommand(
        name: String,
        category: String,
        supportsLegacy: Boolean = false,
        aliases: List<String> = emptyList(),
        block: FoxyCommandDeclarationBuilder.() -> Unit
    ): FoxyCommandDeclarationBuilder {
        return FoxyCommandDeclarationBuilder(
            name,
            description = "placeholderDescription",
            isPrivate = false,
            category = category,
            availableForEarlyAccess = false,
            aliases,
            supportsLegacy,
            integrationType = listOf(IntegrationType.GUILD_INSTALL),
            interactionContexts = listOf(InteractionContextType.GUILD)
        ).apply(block)
    }
}