package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.DblExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DblCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "dbl",
        "dbl.description",
        category = CommandCategory.UTILS,
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