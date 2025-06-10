package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.ServerIconExecutor
import net.cakeyfox.foxy.interactions.vanilla.utils.ServerInfoExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class ServerCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("server", CommandCategory.UTILS) {
        integrationType = listOf(IntegrationType.GUILD_INSTALL)
        interactionContexts = listOf(InteractionContextType.GUILD)

        subCommand("info") {
            addOption(opt(OptionType.STRING, "server_id"), isSubCommand = true)
            executor = ServerInfoExecutor()
        }

        subCommand("icon") {
            addOption(opt(OptionType.STRING, "server_id"), isSubCommand = true)
            executor = ServerIconExecutor()
        }
    }
}