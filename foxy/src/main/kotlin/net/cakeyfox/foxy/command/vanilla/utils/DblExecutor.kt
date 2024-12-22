package net.cakeyfox.foxy.command.vanilla.utils

import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor

class DblExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.reply {
            embed {
                description = context.locale["dbl.embed.description"]
            }
        }
    }
}