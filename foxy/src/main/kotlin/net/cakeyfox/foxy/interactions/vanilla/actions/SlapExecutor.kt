package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.dv8tion.jda.api.entities.User

class SlapExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val response = context.foxy.utils.getActionImage("slap")
        val user = context.getOption<User>("user")!!

        context.reply {
            embed {
                description = context.locale["slap.description", context.event.user.asMention, user.asMention]
                color = Colors.BLUE
                image = response
            }
        }
    }
}