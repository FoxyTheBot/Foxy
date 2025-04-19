package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.ServerIconExecutor
import net.cakeyfox.foxy.command.vanilla.utils.ServerInfoExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ServerCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "server",
        "server.description",
        integrationType = listOf(
            IntegrationType.GUILD_INSTALL
        ),
        interactionContexts = listOf(
            InteractionContextType.GUILD
        ),
        category = "utils",
    ) {
        subCommand(
            "info",
            "server.info.description",
            baseName = this@command.name,
            block = {
                addOption(
                    OptionData(
                        OptionType.STRING,
                        "server_id",
                        "server.info.options.server_id.description",
                        false
                    ),
                    isSubCommand = true,
                    baseName = this@command.name
                )
                executor = ServerInfoExecutor()
                baseName = this@command.name
            }
        )

        subCommand(
            "icon",
            "server.icon.description",
            baseName = this@command.name,
            block = {
                addOption(
                    OptionData(
                        OptionType.STRING,
                        "server_id",
                        "server.icon.options.server_id.description",
                        false
                    ),
                    isSubCommand = true,
                    baseName = this@command.name
                )

                executor = ServerIconExecutor()
                baseName = this@command.name
            }
        )
    }
}