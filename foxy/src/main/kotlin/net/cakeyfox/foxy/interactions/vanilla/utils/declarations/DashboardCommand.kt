package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.DashboardExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DashboardCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        name = "dashboard",
        description = "description",
        category = CommandCategory.UTILS,
        interactionContexts = listOf(
            InteractionContextType.GUILD
        ),
        integrationType = listOf(
            IntegrationType.GUILD_INSTALL
        ),
    ) {
        executor = DashboardExecutor()
    }
}