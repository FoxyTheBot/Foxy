package net.cakeyfox.foxy.command.vanilla.economy.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.AtmExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class CakesCommand: FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "cakes",
        "cakes.description"
    ) {
        subCommand(
            "atm",
            "cakes.atm.description",
            baseName = this@command.name,
            block = {
                executor = AtmExecutor()
                addOption(
                    OptionData(
                        OptionType.USER,
                        "user",
                        "cakes.atm.option.user",
                        false
                    ),
                    isSubCommand = true,
                    baseName = this@command.name
                )
            }
        )
    }
}