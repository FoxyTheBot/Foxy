package net.cakeyfox.foxy.leaderboard

import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import kotlinx.datetime.Instant
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.leaderboard.data.LeaderboardUser
import java.util.concurrent.TimeUnit
import kotlin.system.measureTimeMillis

class LeaderboardManager(
    private val foxy: FoxyInstance
) {
    companion object {
        private val logger = KotlinLogging.logger { }
    }

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
        lateinit var result: List<LeaderboardUser.CakesUser>
        logger.info { "Loading Cakes leaderboard..." }

        val elapsedTime = measureTimeMillis {
            val users = foxy.database.user.getTopUsersByCakes()
            val sorted = users.sortedByDescending { it.balance }

            result = sorted.take(foxy.config.others.leaderboardLimit).mapIndexed { index, user ->
                val rank = index + 1
                val userInfo = foxy.shardManager.retrieveUserById(user.userId).await()

                LeaderboardUser.CakesUser(
                    rank = rank,
                    username = userInfo.globalName ?: userInfo.name,
                    id = user.userId,
                    avatar = userInfo.effectiveAvatarUrl,
                    cakes = foxy.utils.formatLongNumber(user.balance, "pt", "BR")
                )
            }
        }

        logger.info { "Cakes leaderboard loaded in ${elapsedTime}ms" }
        return result
    }

    private suspend fun loadMarriageLeaderboard(): List<LeaderboardUser.MarriageUser> {
        lateinit var result: List<LeaderboardUser.MarriageUser>
        logger.info { "Loading Marriage leaderboard..." }
        val elapsedTime = measureTimeMillis {
            val users = foxy.database.user.getTopMarriedUsers()
            val sorted = users.sortedBy { it.marryStatus.marriedDate ?: Instant.DISTANT_FUTURE }

            result = sorted.take(foxy.config.others.leaderboardLimit).mapIndexed { index, user ->
                val rank = index + 1
                val userInfo = foxy.shardManager.retrieveUserById(user._id).await()

                LeaderboardUser.MarriageUser(
                    rank = rank,
                    username = userInfo.globalName ?: userInfo.name,
                    id = user._id,
                    avatar = userInfo.effectiveAvatarUrl,
                    marriedWith = user.marryStatus.marriedWith ?: "N/A",
                    marriedDate = user.marryStatus.marriedDate ?: Instant.DISTANT_FUTURE
                )
            }
        }

        logger.info { "Marriage leaderboard loaded in ${elapsedTime}ms" }
        return result
    }
}