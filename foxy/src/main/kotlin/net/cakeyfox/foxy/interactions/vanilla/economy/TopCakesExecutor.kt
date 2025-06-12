package net.cakeyfox.foxy.interactions.vanilla.economy

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.leaderboard.data.LeaderboardConfig
import net.cakeyfox.foxy.utils.leaderboard.utils.LeaderboardRender
import net.dv8tion.jda.api.utils.FileUpload

class TopCakesExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val topUsersWithName = context.foxy.leaderboardManager.getCakesLeaderboard()
        val profile = withContext(Dispatchers.IO) {
            LeaderboardRender(LeaderboardConfig(), context).create(topUsersWithName)
        }
        val file = FileUpload.fromData(profile, "ranking.png")

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["top.cakes.embed.title"]
            )

            files.plusAssign(file)
        }
    }
}