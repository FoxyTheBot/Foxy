package net.cakeyfox.foxy.command.vanilla.social.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.social.MarryExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class MarryCommand : FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "marry",
        "marry.description"
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