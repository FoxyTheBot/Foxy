package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor

class DanceExecutor : CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val response = context.foxy.utils.getActionImage("dance")

        context.reply {
            embed {
                description = context.locale["dance.description", context.user.asMention]
                image = response
            }
        }
    }
}