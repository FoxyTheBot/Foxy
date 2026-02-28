package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.UserContextInteractionEvent

class AtmExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val user = when (context.event) {
            is UserContextInteractionEvent -> (context.event as UserContextInteractionEvent).target
            else -> context.getOption("user", 0, User::class.java) ?: context.user
        }
        val userBalance = context.foxy.database.user.getFoxyProfile(user.id).userCakes.balance
        val formattedBalance = context.utils.formatUserBalance(userBalance.toLong(), context.locale)
        val userPositionAtRank = context.foxy.database.user.getUserRankPosition(user.id)

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDaily,
                context.locale[
                    "cakes.atm.balance",
                    user.asMention,
                    formattedBalance,
                    userPositionAtRank.toString()
                ]
            )

            actionRow(
                linkButton(
                    FoxyEmotes.FoxyDaily,
                    context.locale["daily.embed.buyMore"],
                    Constants.PREMIUM
                )
            )
        }
    }
}