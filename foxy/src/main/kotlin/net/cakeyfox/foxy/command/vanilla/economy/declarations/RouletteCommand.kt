package net.cakeyfox.foxy.command.vanilla.economy.declarations

import dev.minn.jda.ktx.interactions.commands.choice
import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.RouletteExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

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
        )
    ) {
        addOptions(
            listOf(
                OptionData(
                    OptionType.INTEGER,
                    "amount",
                    "roulette.option.amount",
                    true
                ),

                OptionData(
                    OptionType.STRING,
                    "color",
                    "roulette.option.color",
                    true
                ).choice("Red", "red")
                    .choice("Black", "black")
                    .choice("Green", "green")
            ),

            baseName = this@command.name
        )

        executor = RouletteExecutor()
    }
}