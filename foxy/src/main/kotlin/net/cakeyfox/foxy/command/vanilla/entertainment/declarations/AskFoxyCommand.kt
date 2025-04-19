package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.AskFoxyExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class AskFoxyCommand: FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "ask",
        "ask.foxy.description",
        category = "fun",
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