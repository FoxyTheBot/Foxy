package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.AskExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType

class AskFoxyCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("ask", CommandCategory.FUN) {
        subCommand("foxy") {
            enableLegacyMessageSupport = true
            aliases = listOf("8ball")
            addOption(opt(OptionType.STRING, "question", true), isSubCommand = true)

            executor = AskExecutor()
        }
    }
}