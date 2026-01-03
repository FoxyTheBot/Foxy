package net.cakeyfox.foxy.interactions.commands

import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions

interface FoxyCommandDeclarationWrapper {
    fun create(): FoxyCommandDeclarationBuilder

    fun slashCommand(
        name: String,
        category: String,
        supportsLegacy: Boolean = false,
        aliases: List<String> = emptyList(),
        defaultMemberPermissions: DefaultMemberPermissions? = null,
        block: FoxyCommandDeclarationBuilder.() -> Unit,
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
            interactionContexts = listOf(InteractionContextType.GUILD),
            defaultMemberPermissions
        ).apply(block)
    }
}