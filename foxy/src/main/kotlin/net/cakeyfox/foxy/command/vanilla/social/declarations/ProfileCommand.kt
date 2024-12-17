package net.cakeyfox.foxy.command.vanilla.social.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.social.ProfileViewExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ProfileCommand: FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "profile",
        "profile.description"
    ) {
        subCommand(
            "view",
            "profile.view.description",
            baseName = this@command.name,
            block = {
                 executor = ProfileViewExecutor()

                addOption(
                    OptionData(
                        OptionType.STRING,
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