package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.TopCakesExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class TopCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "top",
        "top.description",
    ) {
        subCommand(
            "cakes",
            "top.cakes.description",
            baseName = this@command.name,
            interactionContexts = listOf(
                InteractionContextType.GUILD,
                InteractionContextType.PRIVATE_CHANNEL,
                InteractionContextType.BOT_DM
            ),
            integrationType = listOf(
                IntegrationType.USER_INSTALL,
                IntegrationType.GUILD_INSTALL
            )
        ) {
            executor = TopCakesExecutor()
        }

        // TODO: Implement this command later
//        subCommand(
//            "commands",
//            "top.commands.description",
//        ) {
//            executor = TopCommandsExecutor()
//        }
    }
}