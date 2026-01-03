package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.LanguageExecutor
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions

class LanguageCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("language", CommandCategory.UTILS) {
        this.defaultMemberPermissions = DefaultMemberPermissions.enabledFor(Permission.MANAGE_SERVER)
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD
        )
        integrationType = listOf(IntegrationType.GUILD_INSTALL)
        aliases = listOf("idioma", "idiomas", "languages", "fala")

        executor = LanguageExecutor()
    }
}