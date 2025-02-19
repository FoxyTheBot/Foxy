package net.cakeyfox.foxy.command.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.User

class RateWaifuExecutor : FoxyCommandExecutor() {
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