package net.cakeyfox.foxy.command.vanilla.social.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.social.ProfileViewExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ProfileCommand: FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "profile",
        "profile.description",
        interactionContexts = listOf(InteractionContextType.GUILD, InteractionContextType.PRIVATE_CHANNEL),
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)
    ) {
        subCommand(
            "view",
            "profile.view.description",
            baseName = this@command.name,
            block = {
                 executor = ProfileViewExecutor()

                addOption(
                    OptionData(
                        OptionType.USER,
                        "user",
                        "profile.view.option.user",
                        false
                    ),
                    baseName = this@command.name
                )
            }
        )
    }
}