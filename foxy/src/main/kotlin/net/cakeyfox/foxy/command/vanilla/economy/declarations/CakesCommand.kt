package net.cakeyfox.foxy.command.vanilla.economy.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.AtmExecutor
import net.cakeyfox.foxy.command.vanilla.economy.PayExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class CakesCommand : FoxyCommandDeclarationWrapper {
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

        subCommand(
            "pay",
            "cakes.pay.description",
            baseName = this@command.name,

            block = {
                executor = PayExecutor()
                addOptions(
                    listOf(
                        OptionData(
                            OptionType.USER,
                            "user",
                            "cakes.pay.option.user",
                            true
                        ),

                        OptionData(
                            OptionType.INTEGER,
                            "amount",
                            "cakes.pay.option.amount",
                            true
                        ),
                    ),
                    baseName = this@command.name,
                    isSubCommand = true
                )
            }
        )
    }
}