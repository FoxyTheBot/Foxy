package net.cakeyfox.foxy.interactions.vanilla.discord.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.discord.ServerIconExecutor
import net.cakeyfox.foxy.interactions.vanilla.discord.ServerInfoExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class ServerCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("server", CommandCategory.DISCORD) {
        integrationType = listOf(IntegrationType.GUILD_INSTALL)
        interactionContexts = listOf(InteractionContextType.GUILD)

        subCommand("info") {
            addOption(opt(OptionType.STRING, "server_id"), isSubCommand = true)
            supportsLegacy = true
            aliases = listOf("serverinfo")
            executor = ServerInfoExecutor()
        }

        subCommand("icon") {
            addOption(opt(OptionType.STRING, "server_id"), isSubCommand = true)
            supportsLegacy = true
            aliases = listOf("servericon")
            executor = ServerIconExecutor()
        }
    }
}