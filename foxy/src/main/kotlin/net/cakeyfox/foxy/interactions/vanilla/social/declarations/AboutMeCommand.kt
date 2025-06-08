package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.AboutMeExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class AboutMeCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "aboutme",
        "aboutme.description",
        category = CommandCategory.SOCIAL,
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