package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty

class TopCakesExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val topUsersWithName = context.foxy.cacheManager.getCakesLeaderboard()

        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyDaily, context.locale["top.cakes.embed.title"])
                color = Colors.FOXY_DEFAULT
                thumbnail = Constants.DAILY_EMOJI
                topUsersWithName.forEach { (rank, username, cakes) ->
                    field {
                        name = "#$rank. $username"
                        value = "**$cakes** Cakes"
                        inline = true
                    }
                }
            }
        }
    }
}