package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.DblExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DblCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "dbl",
        "dbl.description",
        category = "utils",
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        ),

        integrationType = listOf(
            IntegrationType.GUILD_INSTALL,
            IntegrationType.USER_INSTALL
        )
    ) {
        subCommand(
            "vote",
            "dbl.vote.description",
            baseName = this@command.name,

            block = {
                executor = DblExecutor()
            }
        )
    }
}