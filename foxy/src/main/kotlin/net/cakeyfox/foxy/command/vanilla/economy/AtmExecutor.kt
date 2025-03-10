package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.User

class AtmExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user") ?: context.event.user
        val userBalance = context.foxy.mongoClient.utils.user.getFoxyProfile(user.id).userCakes.balance
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