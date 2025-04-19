package net.cakeyfox.foxy.command.vanilla.social.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.social.AboutMeExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class AboutMeCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "aboutme",
        "aboutme.description",
        category = "social",
        integrationType = listOf(
            IntegrationType.USER_INSTALL,
            IntegrationType.GUILD_INSTALL
        ),
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )
    ) {
        addOption(
            OptionData(
                OptionType.STRING,
                "text",
                "aboutme.text.description",
                true
            ),
            baseName = this@command.name
        )

        executor = AboutMeExecutor()
    }
}