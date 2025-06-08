package net.cakeyfox.foxy.utils.leaderboard

import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import kotlinx.datetime.Instant
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.leaderboard.data.LeaderboardUser
import java.util.concurrent.TimeUnit

class LeaderboardManager(
    private val foxy: FoxyInstance
) {
    private val leaderboardCache = Caffeine.newBuilder()
        .maximumSize(foxy.config.others.leaderboardLimit.toLong())
        .expireAfterWrite(1, TimeUnit.HOURS)
        .build<String, List<LeaderboardUser>>()

    suspend fun getCakesLeaderboard(): List<LeaderboardUser.CakesUser> {
        leaderboardCache.getIfPresent("cakes")?.let {
            return it.filterIsInstance<LeaderboardUser.CakesUser>()
        }

        val leaderboard = loadCakesLeaderboard()
        leaderboardCache.put("cakes", leaderboard)
        return leaderboard
    }

    suspend fun getMarriageLeaderboard(): List<LeaderboardUser.MarriageUser> {
        leaderboardCache.getIfPresent("marriage")?.let {
            return it.filterIsInstance<LeaderboardUser.MarriageUser>()
        }

        val leaderboard = loadMarriageLeaderboard()
        leaderboardCache.put("marriage", leaderboard)
        return leaderboard
    }

    private suspend fun loadCakesLeaderboard(): List<LeaderboardUser.CakesUser> {
        val users = foxy.database.user.getTopUsersByCakes()
        val sorted = users.sortedByDescending { it.userCakes.balance }

        return sorted.take(foxy.config.others.leaderboardLimit).mapIndexed { index, user ->
            val rank = index + 1
            val userInfo = foxy.shardManager.retrieveUserById(user._id).await()

            LeaderboardUser.CakesUser(
                rank = rank,
                username = userInfo.globalName ?: userInfo.name,
                id = user._id,
                avatar = userInfo.effectiveAvatarUrl,
                cakes = foxy.utils.formatLongNumber(user.userCakes.balance.toLong(), "pt", "BR")
            )
        }
    }

    private suspend fun loadMarriageLeaderboard(): List<LeaderboardUser.MarriageUser> {
        val users = foxy.database.user.getTopMarriedUsers()
        val sorted = users.sortedBy { it.marryStatus.marriedDate ?: Instant.Companion.DISTANT_FUTURE }

        return sorted.take(foxy.config.others.leaderboardLimit).mapIndexed { index, user ->
            val rank = index + 1
            val userInfo = foxy.shardManager.retrieveUserById(user._id).await()

            LeaderboardUser.MarriageUser(
                rank = rank,
                username = userInfo.globalName ?: userInfo.name,
                id = user._id,
                avatar = userInfo.effectiveAvatarUrl,
                marriedWith = user.marryStatus.marriedWith ?: "N/A",
                marriedDate = user.marryStatus.marriedDate ?: Instant.Companion.DISTANT_FUTURE
            )
        }
    }
}