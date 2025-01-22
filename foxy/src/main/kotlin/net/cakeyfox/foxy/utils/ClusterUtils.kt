package net.cakeyfox.foxy.utils

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.config.FoxyConfig
import java.util.concurrent.TimeUnit

object ClusterUtils {
    private val logger = KotlinLogging.logger {  }
    private val cachedRoles: Cache<Long, List<String>> = Caffeine.newBuilder()
        .maximumSize(1000)
        .expireAfterWrite(10, TimeUnit.MINUTES)
        .build()
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        prettyPrint = true
    }

    private fun getClusterByShardId(foxy: FoxyInstance, shardId: Int): FoxyConfig.Cluster {
        val shard = foxy.config.discord.clusters.firstOrNull { shardId in it.minShard..it.maxShard }
        return shard ?: throw IllegalArgumentException("Shard $shardId not found in any cluster")
    }

    private fun getShardIdFromGuildId(id: Long, totalShards: Int) = (id shr 22).rem(totalShards).toInt()

    suspend fun getMemberRolesFromCluster(foxy: FoxyInstance, guildId: Long, memberId: Long): List<String> {
        val shardId = getShardIdFromGuildId(guildId, foxy.config.discord.totalShards)
        val cluster = getClusterByShardId(foxy, shardId)
        val rolesResponse = cachedRoles.getIfPresent(memberId)

        if (rolesResponse != null) {
            // Return cached roles to avoid unnecessary API calls
            return rolesResponse
        } else {
            try {
                // Fetch roles from another cluster
                withContext(Dispatchers.IO) {
                    logger.info { "Fetching roles for member $memberId in guild $guildId from cluster ${cluster.id}" }
                    foxy.httpClient.get {
                        url(cluster.clusterUrl + "/api/v1/guilds/$guildId/users/$memberId/roles")
                        header("Content-Type", "application/json")
                        header("Authorization", foxy.config.others.internalApi.key)
                    }
                }.let {
                    val roles = json.decodeFromString(it.bodyAsText()) as List<String>
                    cachedRoles.put(memberId, roles)
                    return roles
                }
            } catch (e: Exception) {
                // If user is not in the guild, return empty list
                return emptyList()
            }
        }
    }
}