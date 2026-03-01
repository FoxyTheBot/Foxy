package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.PlayExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType

class PlayCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("play", CommandCategory.MUSIC) {
        subCommand("music") {
            addOption(opt(OptionType.STRING, "query", true))

            enableLegacyMessageSupport = true
            aliases = listOf("tocar", "t", "play")
            executor = PlayExecutor()
        }

        subCommand("radio") {
            enableLegacyMessageSupport = true
            aliases = listOf("radio")
            executor = PlayExecutor(true)
        }
    }
}