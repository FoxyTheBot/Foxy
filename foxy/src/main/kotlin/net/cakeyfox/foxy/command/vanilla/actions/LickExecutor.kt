package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.entities.User

class LickExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val response = context.foxy.utils.getActionImage("lick")
        val user = context.getOption<User>("user")!!

        context.reply {
            embed {
                description = context.locale["lick.description", context.event.user.asMention, user.asMention]
                color = Colors.BLUE
                image = response
            }
        }
    }
}