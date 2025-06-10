package net.cakeyfox.foxy.interactions.vanilla.economy.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.economy.SlotsChartExecutor
import net.cakeyfox.foxy.interactions.vanilla.economy.SlotsExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class SlotsCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("slots", CommandCategory.ECONOMY) {
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)

        subCommand("chart") { executor = SlotsChartExecutor() }

        subCommand("bet") {
            addOption(
                opt(OptionType.INTEGER, "amount", true),
                isSubCommand = true,
            )
            executor = SlotsExecutor()
        }
    }
}