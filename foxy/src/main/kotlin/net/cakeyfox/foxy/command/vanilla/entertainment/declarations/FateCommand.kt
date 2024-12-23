package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.FateExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class FateCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "fate",
        "fate.description"
    ) {
        subCommand(
            "with_user",
            "fate.with_user.description",
            baseName = this@command.name
        ) {
            executor = FateExecutor()

            addOption(
                OptionData(
                    OptionType.USER,
                    "user",
                    "fate.user.description",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
        }
    }
}