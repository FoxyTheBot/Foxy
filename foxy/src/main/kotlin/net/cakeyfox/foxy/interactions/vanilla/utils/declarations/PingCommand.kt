package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.PingClustersExecutor
import net.cakeyfox.foxy.interactions.vanilla.utils.PingExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class PingCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("foxy", CommandCategory.UTILS) {
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)

        subCommand("ping") {
            aliases = listOf("ping")
            supportsLegacy = true
            executor = PingExecutor()
        }

        subCommand("clusters") {
            supportsLegacy = true
            executor = PingClustersExecutor()
        }
    }
}