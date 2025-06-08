package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.FateExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class FateCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "fate",
        "fate.description",
        category = CommandCategory.FUN,
        ) {
        addOption(
            OptionData(
                OptionType.USER,
                "user",
                "fate.user.description",
                true
            ),
            baseName = this@command.name
        )

        executor = FateExecutor()
    }
}