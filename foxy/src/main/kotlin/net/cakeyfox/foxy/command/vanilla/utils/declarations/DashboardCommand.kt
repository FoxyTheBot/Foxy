package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.DashboardExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DashboardCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        name = "dashboard",
        description = "description",
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