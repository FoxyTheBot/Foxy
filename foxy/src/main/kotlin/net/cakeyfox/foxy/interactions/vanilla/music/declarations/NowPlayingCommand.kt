package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.NowPlayingExecutor

class NowPlayingCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("nowplaying", CommandCategory.MUSIC) {
        enableLegacyMessageSupport = true
        aliases = listOf("np")

        executor = NowPlayingExecutor()
    }
}