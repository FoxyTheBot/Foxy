package net.cakeyfox.foxy.interactions.vanilla.dev.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.dev.ServerInviteRetrieveExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ServerInviteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("serverinvite", CommandCategory.PRIVATE) {
        isPrivate = true

        subCommand("retrieve") {
            addOption(opt(OptionType.STRING, "server_id", true), isSubCommand = true)
            executor = ServerInviteRetrieveExecutor()
        }
    }
}