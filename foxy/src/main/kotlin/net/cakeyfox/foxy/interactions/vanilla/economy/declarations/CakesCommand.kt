package net.cakeyfox.foxy.interactions.vanilla.economy.declarations

import dev.minn.jda.ktx.interactions.commands.choice
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.economy.*
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class CakesCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("cakes", CommandCategory.ECONOMY) {
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)

        subCommand("atm") {
            executor = AtmExecutor()
            addOptions(
                listOf(
                    opt(OptionType.USER, "user")
                ),

                isSubCommand = true
            )
        }

        subCommand("top") { executor = TopCakesExecutor() }

        subCommand("pay") {
            addOptions(
                listOf(
                    opt(OptionType.USER, "user", true),
                    opt(OptionType.INTEGER, "amount", true)
                ),
                isSubCommand = true
            )

            executor = PayExecutor()
        }

        subCommand("coinflipbet") {
            addOptions(
                listOf(
                    opt(OptionType.USER, "user", true),
                    opt(OptionType.INTEGER, "amount", true),
                    opt(OptionType.STRING, "side", true)
                        .choice("Heads", "heads")
                        .choice("Tails", "tails")
                ),
                isSubCommand = true
            )

            executor = CoinflipBetExecutor()
        }
    }
}