package net.cakeyfox.foxy.interactions.vanilla.economy.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.economy.RouletteExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class RouletteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("roulette", CommandCategory.ECONOMY,) {
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)

        executor = RouletteExecutor()
    }
}