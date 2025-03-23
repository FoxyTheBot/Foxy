package net.cakeyfox.foxy.utils

import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import java.util.concurrent.TimeUnit
import kotlin.system.measureTimeMillis

class FoxyCacheManager(
    private val foxy: FoxyInstance
) {
    private lateinit var topUsersWithNames: List<Triple<Int, String, String>>
    private val cachedTopUsers = Caffeine.newBuilder()
        .maximumSize(foxy.config.others.leaderboardLimit.toLong())
        .expireAfterWrite(1, TimeUnit.HOURS)
        .build<String, List<TopUser>>()

    private val logger = KotlinLogging.logger { }

    suspend fun getCakesLeaderboard() = loadCakesLeaderboard()

    suspend fun loadCakesLeaderboard(): List<Triple<Int, String, String>> {
       val executionTime = measureTimeMillis {
            val users = foxy.database.user.getTopUsersByCakes()
            val sorted = users.sortedByDescending { it.userCakes.balance }

            val topUsers = sorted.take(foxy.config.others.leaderboardLimit)

            val topUsersWithName = topUsers.mapIndexed { index, user ->
                try {
                    if (cachedTopUsers.getIfPresent("default") != null) {
                        val cachedTopUsers = cachedTopUsers.getIfPresent("default")!!
                        val cachedUser = cachedTopUsers.find { it.id == user._id }
                        if (cachedUser != null) {
                            logger.debug { "Found user in cache: $cachedUser" }
                            return@mapIndexed Triple(cachedUser.rank, cachedUser.username, cachedUser.cakes)
                        }
                    }

                    val rank = index + 1
                    val userInfo = foxy.shardManager.retrieveUserById(user._id).await()
                    val username = userInfo.globalName ?: userInfo.name
                    val cakes = foxy.utils.formatLongNumber(user.userCakes.balance.toLong(), "pt", "BR")
                    val avatar = userInfo.effectiveAvatarUrl
                    val topUser = TopUser(
                        rank,
                        username,
                        cakes,
                        user._id,
                        avatar
                    )

                    if (cachedTopUsers.getIfPresent("default") == null) {
                        cachedTopUsers.put("default", listOf(topUser))
                    } else {
                        val currentTopUsers = cachedTopUsers.getIfPresent("default")!!.toMutableList()
                        currentTopUsers.add(topUser)
                        cachedTopUsers.put("default", currentTopUsers)
                        logger.debug { "Added user to top cache: $topUser" }
                    }

                    Triple(rank, username, cakes)
                } catch (e: Exception) {
                    logger.error { "Failed to get user info: ${e.message}" }
                    Triple(index + 1, "Unknown", "0")
                }
            }

            topUsersWithNames = topUsersWithName
        }

        logger.info { "Cakes Global Leaderboard loaded in ${executionTime}ms" }
        return topUsersWithNames
    }
}