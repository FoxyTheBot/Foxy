package net.cakeyfox.foxy.command.vanilla.entertainment

import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.dv8tion.jda.api.entities.User

class CancelExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user")!!
        val reason = context.getOption<String>("reason")!!

        context.reply {
            content = context.prettyResponse {
                content = context.locale["cancel.success", user.asMention, reason]
            }
        }
    }
}