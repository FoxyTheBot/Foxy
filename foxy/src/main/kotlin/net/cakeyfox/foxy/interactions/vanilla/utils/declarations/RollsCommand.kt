package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.RollsExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class RollsCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("rolls", CommandCategory.UTILS) {
        addOption(opt(OptionType.INTEGER, "dices", false))
        addOption(opt(OptionType.INTEGER, "sides", false))
        integrationType = listOf(
            IntegrationType.GUILD_INSTALL,
            IntegrationType.USER_INSTALL
        )
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL,
            InteractionContextType.BOT_DM
        )
        executor = RollsExecutor()
    }
}