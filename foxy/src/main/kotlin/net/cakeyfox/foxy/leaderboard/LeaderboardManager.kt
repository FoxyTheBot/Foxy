package net.cakeyfox.foxy.leaderboard

import dev.minn.jda.ktx.coroutines.await
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.leaderboard.data.LeaderboardUser

class LeaderboardManager(
    private val foxy: FoxyInstance
) {
    companion object {
        private val logger = KotlinLogging.logger { }
    }

    suspend fun getCakesLeaderboardByPage(page: Int, pageSize: Int? = 10): List<LeaderboardUser.CakesUser> {
        val cakeLeaderboard = foxy.database.user.getCakesLeaderboardPage(page, pageSize)

        return cakeLeaderboard.mapIndexed { index, userBalance ->
            val rank = (page - 1) * pageSize!! + index + 1
            val user = foxy.shardManager.retrieveUserById(userBalance._id).await()

            LeaderboardUser.CakesUser(
                rank = rank,
                username = user.effectiveName,
                id = user.id,
                avatar = user.effectiveAvatarUrl,
                cakes = foxy.utils.formatLongNumber(userBalance.userCakes.balance.toLong())
            )
        }
    }
}
