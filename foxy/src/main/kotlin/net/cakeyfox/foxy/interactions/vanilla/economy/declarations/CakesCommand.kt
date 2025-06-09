package net.cakeyfox.foxy.interactions.vanilla.economy.declarations

import dev.minn.jda.ktx.interactions.commands.choice
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.economy.*
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class CakesCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "cakes",
        "cakes.description",
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        ),

        integrationType = listOf(
            IntegrationType.USER_INSTALL,
            IntegrationType.GUILD_INSTALL
        ),
        category = CommandCategory.ECONOMY
    ) {
        subCommand(
            "atm",
            "cakes.atm.description",
            block = {
                baseName = this@command.name
                executor = AtmExecutor()
                addOptions(
                    listOf(
                        OptionData(
                            OptionType.USER,
                            "user",
                            "cakes.atm.option.user",
                            false
                        )
                    ),

                    isSubCommand = true,
                    baseName = this@command.name
                )
            }
        )
        subCommand(
            "top",
            "cakes.top.description",
            block = {
                baseName = this@command.name
                executor = TopCakesExecutor()
            }
        )

        subCommand(
            "pay",
            "cakes.pay.description",
            block = {
                baseName = this@command.name
                executor = PayExecutor()
                addOptions(
                    listOf(
                        OptionData(
                            OptionType.USER,
                            "user",
                            "cakes.pay.option.user",
                            true
                        ),

                        OptionData(
                            OptionType.INTEGER,
                            "amount",
                            "cakes.pay.option.amount",
                            true
                        )
                    ),
                    baseName = this@command.name,
                    isSubCommand = true
                )
            }
        )

        subCommand(
            "coinflipbet",
            "cakes.coinflipbet.description",
            block = {
                baseName = this@command.name
                executor = CoinflipBetExecutor()

                addOptions(
                    listOf(
                        OptionData(
                            OptionType.USER,
                            "user",
                            "cakes.coinflipbet.option.user",
                            true
                        ),

                        OptionData(
                            OptionType.INTEGER,
                            "amount",
                            "cakes.coinflipbet.option.amount",
                            true
                        ),

                        OptionData(
                            OptionType.STRING,
                            "side",
                            "cakes.coinflipbet.option.side",
                            true
                        ).choice("Heads", "heads")
                            .choice("Tails", "tails")
                    ),
                    isSubCommand = true,
                    baseName = this@command.name
                )
            }
        )
    }
}