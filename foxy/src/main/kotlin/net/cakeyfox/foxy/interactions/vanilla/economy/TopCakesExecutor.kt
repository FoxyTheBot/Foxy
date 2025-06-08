package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class TopCakesExecutor : CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val topUsersWithName = context.foxy.leaderboardManager.getCakesLeaderboard()

        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyDaily, context.locale["top.cakes.embed.title"])
                color = Colors.FOXY_DEFAULT
                thumbnail = Constants.DAILY_EMOJI

                topUsersWithName.forEach { (rank, username, balance) ->
                    val formattedCakes = context.utils.formatLongNumber(balance.toLong(), "pt", "BR")

                    field {
                        name = "#$rank. $username"
                        value = "**$formattedCakes** Cakes"
                        inline = true
                    }
                }
            }
        }
    }
}