package net.cakeyfox.foxy.interactions.vanilla.economy.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.economy.SlotsChartExecutor
import net.cakeyfox.foxy.interactions.vanilla.economy.SlotsExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class SlotsCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "slots",
        "slots.description",
        integrationType = listOf(
            IntegrationType.GUILD_INSTALL,
            IntegrationType.USER_INSTALL
        ),

        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        ),
        category = CommandCategory.ECONOMY,
        ) {
        subCommand(
            "chart",
            "slots.chart.description",
            block = {
                executor = SlotsChartExecutor()
            }
        )

        subCommand(
            "bet",
            "slots.bet.description",
            baseName = this@command.name,
            block = {
                addOption(
                    OptionData(
                        OptionType.INTEGER,
                        "amount",
                        "slots.bet.option.amount",
                        true
                    ),
                    baseName = this@command.name,
                    isSubCommand = true,
                )
                executor = SlotsExecutor()
            }
        )
    }
}