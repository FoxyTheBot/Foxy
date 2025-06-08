package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.ProfileViewExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ProfileCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "profile",
        "profile.description",
        category = CommandCategory.SOCIAL,
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL,
            InteractionContextType.BOT_DM
        ),
        integrationType = listOf(
            IntegrationType.USER_INSTALL,
            IntegrationType.GUILD_INSTALL
        )
    ) {
        addOption(
            OptionData(
                OptionType.USER,
                "user",
                "profile.view.option.user",
                false
            ),
            baseName = this@command.name
        )

        executor = ProfileViewExecutor()
    }
}