package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.AskExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class AskFoxyCommand: FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "ask",
        "ask.foxy.description",
        category = CommandCategory.FUN,
        ) {
            subCommand(
                "foxy",
                "ask.foxy.description",
                baseName = this@command.name,
                block = {
                    executor = AskExecutor()
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