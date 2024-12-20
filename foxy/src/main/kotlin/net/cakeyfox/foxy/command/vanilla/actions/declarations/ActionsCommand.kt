package net.cakeyfox.foxy.command.vanilla.actions.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.actions.KissExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ActionsCommand: FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "actions",
        "actions.description"
    ) {
        baseName = this@command.name

        subCommand("kiss", "actions.kiss.description") {
            baseName = this@command.name
            addOption(
                OptionData(
                    OptionType.USER,
                    "user",
                    "actions.kiss.options.user",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
            executor = KissExecutor()
        }
    }
}