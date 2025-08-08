package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.CancelExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType

class CancelCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("cancel", CommandCategory.FUN) {
        addOptions(
            listOf(
                opt(OptionType.USER, "user", true),
                opt(OptionType.STRING, "reason", true)
            )
        )

        supportsLegacy = true
        aliases = listOf("cancelar")
        executor = CancelExecutor()
    }
}