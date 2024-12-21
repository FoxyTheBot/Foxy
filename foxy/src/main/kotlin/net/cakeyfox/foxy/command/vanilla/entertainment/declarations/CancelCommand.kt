package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.CancelExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class CancelCommand : FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "cancel",
        "cancel.description"
    ) {
        executor = CancelExecutor()
        addOption(
            OptionData(
                OptionType.STRING,
                "reason",
                "cancel.reason.description",
                true
            ),
            baseName = this@command.name
        )
    }
}