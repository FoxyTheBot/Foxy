package net.cakeyfox.foxy.interactions.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User

class RateWaifuExecutor : CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user")!!
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