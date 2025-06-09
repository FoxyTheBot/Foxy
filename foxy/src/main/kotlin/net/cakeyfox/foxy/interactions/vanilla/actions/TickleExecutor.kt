package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.dv8tion.jda.api.entities.User

class TickleExecutor : FoxySlashCommandExecutor() {
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