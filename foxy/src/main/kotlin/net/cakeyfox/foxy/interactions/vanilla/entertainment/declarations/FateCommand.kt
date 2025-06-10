package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.FateExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType

class FateCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("fate", CommandCategory.FUN) {
        addOption(opt(OptionType.USER, "user", true))

        executor = FateExecutor()
    }
}