package net.cakeyfox.foxy.interactions.vanilla.discord.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.discord.DashboardExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DashboardCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand(name = "dashboard", CommandCategory.DISCORD) {
        interactionContexts = listOf(InteractionContextType.GUILD)
        integrationType = listOf(IntegrationType.GUILD_INSTALL)

        enableLegacyMessageSupport = true
        aliases = listOf("dashboard")
        executor = DashboardExecutor()
    }
}