package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor

class DanceExecutor : FoxyCommandExecutor() {
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