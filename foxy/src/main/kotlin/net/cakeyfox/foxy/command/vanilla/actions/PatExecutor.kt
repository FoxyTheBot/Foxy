package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.entities.User

class PatExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val response = context.instance.utils.getActionImage("pat")
        val user = context.getOption<User>("user")!!

        context.reply {
            embed {
                description = context.locale["pat.description", context.event.user.asMention, user.asMention]
                color = Colors.BLUE
                image = response
            }
        }
    }
}