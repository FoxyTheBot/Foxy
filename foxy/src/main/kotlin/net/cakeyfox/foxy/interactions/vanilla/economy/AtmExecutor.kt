package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User

class AtmExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java) ?: context.user
        val userBalance = context.foxy.database.user.getFoxyProfile(user.id).userCakes.balance
        val formattedBalance = context.utils.formatUserBalance(userBalance.toLong(), context.locale)

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDaily,
                context.locale[
                    "cakes.atm.balance",
                    user.asMention,
                    formattedBalance
                ]
            )
        }
    }

}