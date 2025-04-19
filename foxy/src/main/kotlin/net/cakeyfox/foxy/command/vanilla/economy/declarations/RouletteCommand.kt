package net.cakeyfox.foxy.command.vanilla.economy.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.RouletteExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class RouletteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "roulette",
        "roulette.description",
        availableForEarlyAccess = false,
        integrationType = listOf(
            IntegrationType.GUILD_INSTALL,
            IntegrationType.USER_INSTALL
        ),
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        ),
        category = "economy",
        ) {
        executor = RouletteExecutor()
    }
}