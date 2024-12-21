package net.cakeyfox.foxy.command.vanilla.social.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.social.AboutMeExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class AboutMeCommand: FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "aboutme",
        "aboutme.description"
    ) {
        subCommand(
            "change",
            "aboutme.change.description",
            baseName = this@command.name,

            block = {
                addOption(
                    OptionData(
                        OptionType.STRING,
                        "text",
                        "aboutme.text.description",
                        true
                    ),
                    isSubCommand = true,
                    baseName = this@command.name
                )

                executor = AboutMeExecutor()
            }
        )

    }
}