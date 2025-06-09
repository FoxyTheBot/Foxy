package net.cakeyfox.foxy.interactions.vanilla.dev.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.dev.ServerInviteRetrieveExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ServerInviteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "serverinvite",
        "serverinvite.description",
        isPrivate = true,
        category = CommandCategory.PRIVATE
    ) {
        subCommand(
            "retrieve",
            "serverinvite.retrieve.description",
            block = {
                baseName = this@command.name
                addOption(
                    OptionData(
                        OptionType.STRING,
                        "server_id",
                        "serverinvite.option.server",
                        true
                    ),

                    isSubCommand = true,
                    baseName = this@command.name
                )

                baseName = this@command.name
                executor = ServerInviteRetrieveExecutor()
            }
        )
    }
}