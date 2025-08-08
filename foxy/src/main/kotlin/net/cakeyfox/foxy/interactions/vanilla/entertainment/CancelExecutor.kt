package net.cakeyfox.foxy.interactions.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User

class CancelExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()

        val user = context.getOption("user", 0, User::class.java)
        val reason = context.getOption("reason", 1, String::class.java, true)

        if (user == null || reason == null) return

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["cancel.userCancelledBecause", user.asMention, reason]
            )
        }
    }
}