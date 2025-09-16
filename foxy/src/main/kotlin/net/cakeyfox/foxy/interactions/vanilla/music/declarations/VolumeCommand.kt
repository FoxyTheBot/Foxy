package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.VolumeExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType

class VolumeCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("volume", CommandCategory.MUSIC) {
        supportsLegacy = true
        aliases = listOf("vol", "volume")
        addOption(opt(
            OptionType.INTEGER, "level", true)
            .setMinValue(0)
            .setMaxValue(100)
        )

         executor = VolumeExecutor()
    }
}