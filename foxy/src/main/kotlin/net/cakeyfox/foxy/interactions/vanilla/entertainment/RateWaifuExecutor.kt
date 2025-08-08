package net.cakeyfox.foxy.interactions.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User

class RateWaifuExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java)
        if (user == null) return
        val rating = (0..10).random()

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyYay,
                context.locale["ratewaifu.success",
                    rating.toString(),
                    user.asMention
                ]
            )
        }
    }
}