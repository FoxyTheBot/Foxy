package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor

class SmileExecutor : CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val response = context.foxy.utils.getActionImage("smile")

        context.reply {
            embed {
                description = context.locale["smile.description", context.user.asMention]
                color = Colors.BLUE
                image = response
            }
        }
    }
}