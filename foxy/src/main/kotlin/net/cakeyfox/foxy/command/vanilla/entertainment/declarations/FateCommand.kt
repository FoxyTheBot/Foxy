package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.FateExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class FateCommand : FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "fate",
        "fate.description"
    ) {
        executor = FateExecutor()

        addOption(
            OptionData(
                OptionType.USER,
                "user",
                "fate.user.description",
                true
            ),

            baseName = this@command.name
        )
    }
}