package net.cakeyfox.foxy.command.vanilla.economy.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.RobExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class RobCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "rob",
        "rob.description",

        availableForEarlyAccess = true,
        integrationType = listOf(
            IntegrationType.GUILD_INSTALL
        ),
        interactionContexts = listOf(
            InteractionContextType.GUILD
        )
    ) {
        subCommand(
            "someone",
            "rob.someone.description",
            baseName = this@command.name,

            block = {
                addOption(
                    OptionData(
                        OptionType.USER,
                        "user",
                        "rob.someone.option.user",
                        true
                    ),
                    isSubCommand = true,
                    baseName = this@command.name
                )

                executor = RobExecutor()
            }
        )
    }
}