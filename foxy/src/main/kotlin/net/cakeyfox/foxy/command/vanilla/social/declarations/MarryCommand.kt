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
        category = "social",
        interactionContexts = listOf(
            InteractionContextType.GUILD
        ),

        integrationType = listOf(
            IntegrationType.GUILD_INSTALL
        )
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
}