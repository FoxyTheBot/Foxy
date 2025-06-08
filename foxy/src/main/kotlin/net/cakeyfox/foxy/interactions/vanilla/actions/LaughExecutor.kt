package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor

class LaughExecutor : CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val response = context.foxy.utils.getActionImage("laugh")

        context.reply {
            embed {
                description = context.locale["laugh.description", context.user.asMention]
                color = Colors.PURPLE
                image = response
            }
        }
    }
}