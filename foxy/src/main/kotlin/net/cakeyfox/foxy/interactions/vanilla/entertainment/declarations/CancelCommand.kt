package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.CancelExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class CancelCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "cancel",
        "cancel.description",
        category = CommandCategory.FUN,
        ) {
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

        executor = CancelExecutor()
    }
}