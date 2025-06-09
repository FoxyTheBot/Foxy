package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User

class AtmExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user") ?: context.event.user
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