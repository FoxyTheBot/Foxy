package net.cakeyfox.foxy.interactions.vanilla.social

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class TopMarriageExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val topUsers = context.foxy.leaderboardManager.getMarriageLeaderboard()

        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyYay, context.locale["top.marriage.embed.title"])
                color = Colors.FOXY_DEFAULT
                topUsers.forEach { user ->
                    val formattedDate = context.utils.convertISOToSimpleDiscordTimestamp(user.marriedDate)

                    field {
                        name = "#${user.rank}. ${user.username}"
                        value = "**Casado(a) com:** ${user.marriedWith}\nDesde: $formattedDate"
                        inline = true
                    }
                }
            }
        }
    }
}