package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor

class TickleExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val response = context.instance.utils.getActionImage("tickle")

        context.reply {
            embed {
                description = context.locale["tickle.description"]
                color = Colors.BLUE
                image = response
            }
        }
    }
}