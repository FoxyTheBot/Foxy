package net.cakeyfox.foxy.command.vanilla.economy.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.DailyExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DailyCommand: FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "daily",
        "daily.description",
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        ),

        integrationType = listOf(
            IntegrationType.GUILD_INSTALL,
            IntegrationType.USER_INSTALL
        ),
        block = {
            executor = DailyExecutor()
        }
    )
}