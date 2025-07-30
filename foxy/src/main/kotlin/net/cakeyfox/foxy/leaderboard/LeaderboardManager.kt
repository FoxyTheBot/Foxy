package net.cakeyfox.foxy.leaderboard

import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
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

    private val cakesLoadMutex = Mutex()
    private val marriageLoadMutex = Mutex()

    private var cakesLoadingResult: List<LeaderboardUser.CakesUser>? = null
    private var marriageLoadingResult: List<LeaderboardUser.MarriageUser>? = null

    private val refreshIntervalMillis = TimeUnit.HOURS.toMillis(1)

    suspend fun getCakesLeaderboard(): List<LeaderboardUser.CakesUser> {
        leaderboardCache.getIfPresent("cakes")?.let {
            logger.info { "Returning cakes leaderboard from cache" }
            return it.filterIsInstance<LeaderboardUser.CakesUser>()
        }

        cakesLoadingResult?.let {
            logger.info { "Cakes load already in progress, returning pending result" }
            return it
        }

        return cakesLoadMutex.withLock {
            leaderboardCache.getIfPresent("cakes")?.let {
                logger.info { "Returning cakes leaderboard from cache after lock wait" }
                return it.filterIsInstance<LeaderboardUser.CakesUser>()
            }
            cakesLoadingResult?.let {
                logger.info { "Cakes load already in progress after lock wait, returning pending result" }
                return it
            }

            logger.info { "Starting cakes leaderboard load" }
            val leaderboard = loadCakesLeaderboard()
            leaderboardCache.put("cakes", leaderboard)
            cakesLoadingResult = leaderboard

            val result = leaderboard
            cakesLoadingResult = null
            logger.info { "Cakes leaderboard load completed" }
            result
        }
    }

    suspend fun getMarriageLeaderboard(): List<LeaderboardUser.MarriageUser> {
        leaderboardCache.getIfPresent("marriage")?.let {
            logger.info { "Returning marriage leaderboard from cache" }
            return it.filterIsInstance<LeaderboardUser.MarriageUser>()
        }

        marriageLoadingResult?.let {
            logger.info { "Marriage load already in progress, returning pending result" }
            return it
        }

        return marriageLoadMutex.withLock {
            leaderboardCache.getIfPresent("marriage")?.let {
                logger.info { "Returning marriage leaderboard from cache after lock wait" }
                return it.filterIsInstance<LeaderboardUser.MarriageUser>()
            }
            marriageLoadingResult?.let {
                logger.info { "Marriage load already in progress after lock wait, returning pending result" }
                return it
            }

            logger.info { "Starting marriage leaderboard load" }
            val leaderboard = loadMarriageLeaderboard()
            leaderboardCache.put("marriage", leaderboard)
            marriageLoadingResult = leaderboard

            val result = leaderboard
            marriageLoadingResult = null
            logger.info { "Marriage leaderboard load completed" }
            result
        }
    }

    private suspend fun loadCakesLeaderboard(): List<LeaderboardUser.CakesUser> {
        lateinit var result: List<LeaderboardUser.CakesUser>
        logger.info { "Loading Cakes leaderboard..." }

        val elapsedTime = measureTimeMillis {
            val users = foxy.database.user.getTopUsersByCakes()
            val sorted = users.sortedByDescending { it.balance }

            result = sorted.mapIndexed { index, user ->
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
        logger.info { "Loading Marriage leaderboard..." }

        val processedUsers = mutableSetOf<String>()
        val result = mutableListOf<LeaderboardUser.MarriageUser>()

        val desiredAmount = foxy.config.others.leaderboardLimit

        val elapsedTime = measureTimeMillis {
            val rawUsers = foxy.database.user.getTopMarriedUsers()
            for (user in rawUsers) {
                val userId = user._id
                val partnerId = user.marryStatus.marriedWith

                if (
                    userId in processedUsers ||
                    partnerId == null ||
                    partnerId in processedUsers
                ) continue

                val userInfo = try {
                    foxy.shardManager.retrieveUserById(userId).await()
                } catch (_: Exception) {
                    continue
                }

                val partnerInfo = try {
                    foxy.shardManager.retrieveUserById(partnerId).await()
                } catch (_: Exception) {
                    continue
                }

                val userName = userInfo.name
                val partnerName = partnerInfo.name

                if ("deleted_user" in userName || "deleted_user" in partnerName) continue

                processedUsers += listOf(userId, partnerId)

                result.add(
                    LeaderboardUser.MarriageUser(
                        rank = 0,
                        username = "$userName and $partnerName",
                        id = userId,
                        avatar = userInfo.effectiveAvatarUrl,
                        marriedWith = partnerId,
                        marriedDate = user.marryStatus.marriedDate ?: Instant.DISTANT_FUTURE
                    )
                )

                if (result.size >= desiredAmount) break
            }

            result.sortBy { it.marriedDate }
            result.forEachIndexed { index, marriageUser ->
                marriageUser.rank = index + 1
            }
        }

        logger.info { "Marriage leaderboard loaded in ${elapsedTime}ms" }
        return result
    }

    /**
     * Starts automatic refresh of leaderboards every 1 hour.
     */
    fun startAutoRefresh(scope: CoroutineScope = CoroutineScope(foxy.coroutineDispatcher)) {
        scope.launch {
            while (true) {
                try {
                    logger.info { "Updating leaderboards..." }
                    cakesLoadMutex.withLock {
                        val cakes = loadCakesLeaderboard()
                        leaderboardCache.put("cakes", cakes)
                    }
//                    marriageLoadMutex.withLock {
//                        val marriage = loadMarriageLeaderboard()
//                        leaderboardCache.put("marriage", marriage)
//                    }
                } catch (ex: Exception) {
                    logger.error(ex) { "Error during leaderboards auto-refresh" }
                }
                delay(refreshIntervalMillis)
            }
        }
    }
}
