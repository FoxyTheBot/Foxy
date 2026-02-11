package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.GayCommandExecutor
import net.dv8tion.jda.api.interactions.commands.Command
import net.dv8tion.jda.api.interactions.commands.OptionType

class GayCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("gay", CommandCategory.FUN) {
        contextMenu(
            Command.Type.USER,
            this.name
        )

        enableLegacyMessageSupport = true
        aliases = listOf("gay")

        addOption(
            opt(
                OptionType.USER,
                "user"
            )
        )

        executor = GayCommandExecutor()
    }
}