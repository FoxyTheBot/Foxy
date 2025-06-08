package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.RateWaifuExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class RateWaifuCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "ratewaifu",
        "ratewaifu.description",
        category = CommandCategory.FUN,
        ) {
        addOption(
            OptionData(
                OptionType.USER,
                "user",
                "ratewaifu.user.description",
                true
            ),
            baseName = this@command.name
        )

        executor = RateWaifuExecutor()
    }
}