package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.StatusExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class StatusCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("status", CommandCategory.UTILS) {
        interactionContexts = listOf(
            InteractionContextType.PRIVATE_CHANNEL,
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD
        )
        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)

        executor = StatusExecutor()
    }
}