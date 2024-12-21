package net.cakeyfox.foxy.command.vanilla.entertainment

import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.dv8tion.jda.api.entities.User

class RateWaifuExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user")!!

        val rating = (user.idLong % 100).toInt()

        context.reply {
            content = context.prettyResponse {
                content = context.locale["ratewaifu.success", "<@!${user.id}>", rating.toString()]
            }
        }
    }
}