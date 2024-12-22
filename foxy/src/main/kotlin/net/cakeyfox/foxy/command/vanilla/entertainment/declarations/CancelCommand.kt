package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.CancelExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class CancelCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "cancel",
        "cancel.description"
    ) {
        subCommand(
            "someone",
            "cancel.someone.description",
            baseName = this@command.name,

            block = {
                executor = CancelExecutor()
                addOptions(
                    listOf(
                        OptionData(
                            OptionType.USER,
                            "user",
                            "cancel.someone.user.description",
                            true
                        ),

                        OptionData(
                            OptionType.STRING,
                            "reason",
                            "cancel.someone.reason.description",
                            true
                        )
                    ),

                    baseName = this@command.name
                )
            }
        )
    }
}