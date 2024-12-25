package net.cakeyfox.foxy.command.vanilla.social.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.social.MarryExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class MarryCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "marry",
        "marry.description",

        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        ),

        integrationType = listOf(
            IntegrationType.USER_INSTALL,
            IntegrationType.GUILD_INSTALL
        )
    ) {
        subCommand(
            "propose",
            "marry.propose.description",
            baseName = this@command.name,
            block = {
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
        )
    }
}