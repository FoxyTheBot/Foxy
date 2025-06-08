package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.MarryExecutor
import net.cakeyfox.foxy.interactions.vanilla.social.TopMarriageExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class MarryCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "marry",
        "marry.description",
        category = CommandCategory.SOCIAL,
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL,
        ),

        integrationType = listOf(
            IntegrationType.GUILD_INSTALL,
            IntegrationType.USER_INSTALL
        )
    ) {
        subCommand(
            "ask",
            "marry.ask.description",
            interactionContexts = listOf(
                InteractionContextType.GUILD,
                InteractionContextType.PRIVATE_CHANNEL
            ),

            integrationType = listOf(
                IntegrationType.GUILD_INSTALL,
                IntegrationType.USER_INSTALL
            ),

            baseName = this@command.name
        ) {
            addOption(
                OptionData(
                    OptionType.USER,
                    "user",
                    "marry.user.description",
                    true
                ),
                baseName = this@command.name
            )

            executor = MarryExecutor()
        }

        subCommand(
            "leaderboard",
            "marry.leaderboard.description",
            interactionContexts = listOf(
                InteractionContextType.GUILD,
                InteractionContextType.PRIVATE_CHANNEL,
                InteractionContextType.BOT_DM
            ),

            integrationType = listOf(
                IntegrationType.USER_INSTALL,
                IntegrationType.GUILD_INSTALL
            ),

            baseName = this@command.name
        ) {
            executor = TopMarriageExecutor()
        }
    }
}