package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.entities.User

class TickleExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val user = context.getOption<User>("user")!!
        val response = context.foxy.utils.getActionImage("tickle")

        context.reply {
            embed {
                description = context.locale["tickle.description", context.user.asMention, user.asMention]
                color = Colors.BLUE
                image = response
            }
        }
    }
}