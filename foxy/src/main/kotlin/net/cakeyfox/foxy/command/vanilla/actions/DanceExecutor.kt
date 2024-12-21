package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor

class DanceExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val response = context.instance.utils.getActionImage("dance")

        context.reply {
            embed {
                description = context.locale["dance.description"]
                image = response
            }
        }
    }
}