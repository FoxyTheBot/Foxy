package net.cakeyfox.foxy.command.vanilla.dev.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.dev.ServerInviteRetrieveExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ServerInviteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "serverinvite",
        "serverinvite.description",
        isPrivate = true
    ) {
        subCommand(
            "retrieve",
            "serverinvite.retrieve.description",
            baseName = this@command.name,

            block = {
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