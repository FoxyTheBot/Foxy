package net.cakeyfox.foxy.interactions.commands

import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions

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
        aliases: List<String> = emptyList(),
        enableLegacyMessageSupport: Boolean = false,
        integrationType: List<IntegrationType> = listOf(IntegrationType.GUILD_INSTALL),
        interactionContexts: List<InteractionContextType> = listOf(InteractionContextType.GUILD),
        defaultMemberPermissions: DefaultMemberPermissions?,
        block: FoxyCommandDeclarationBuilder.() -> Unit
    ) {
        val subCommand = FoxyCommandDeclarationBuilder(
            name,
            description,
            isPrivate,
            category,
            availableForEarlyAccess,
            aliases,
            enableLegacyMessageSupport,
            integrationType,
            interactionContexts,
            defaultMemberPermissions
        )
        subCommand.block()
        subCommands.add(subCommand)
    }

    fun getSubCommand(name: String): FoxyCommandDeclarationBuilder? {
        return subCommands.find { it.name == name }
    }
}