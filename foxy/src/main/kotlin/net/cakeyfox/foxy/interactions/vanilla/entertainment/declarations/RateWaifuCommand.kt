package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.RateWaifuExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType

class RateWaifuCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("ratewaifu", CommandCategory.FUN) {
        addOption(
            opt(
                OptionType.USER,
                "user",
                true
            )
        )

        enableLegacyMessageSupport = true
        aliases = listOf("avaliarwaifu")
        executor = RateWaifuExecutor()
    }
}