package net.cakeyfox.foxy.interactions.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User

class CancelExecutor : CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val user = context.getOption<User>("user")!!
        val reason = context.getOption<String>("reason")!!

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["cancel.userCancelledBecause", user.asMention, reason]
            )
        }
    }
}