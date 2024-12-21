package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.AskFoxyExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class AskFoxyCommand: FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "ask",
        "ask.foxy.description",
        ) {
            subCommand(
                "foxy",
                "ask.foxy.description",
                baseName = this@command.name,
                block = {
                    executor = AskFoxyExecutor()
                    addOption(
                        OptionData(
                            OptionType.STRING,
                            "question",
                            "ask.foxy.question",
                            true
                        ),
                        isSubCommand = true,
                        baseName = this@command.name
                    )
                }
            )
    }
}