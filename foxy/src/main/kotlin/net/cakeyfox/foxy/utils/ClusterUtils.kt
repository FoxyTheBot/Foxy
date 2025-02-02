package net.cakeyfox.foxy.utils

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.CustomGuildInfo
import net.cakeyfox.serializable.database.utils.FoxyConfig
import org.jetbrains.annotations.TestOnly
import java.util.concurrent.TimeUnit

object ClusterUtils {
    private val logger = KotlinLogging.logger { }
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

    fun getShardIdFromGuildId(id: Long, totalShards: Int) = (id shr 22).rem(totalShards).toInt()

    suspend fun getGuildInfo(foxy: FoxyInstance, guildId: Long): CustomGuildInfo? {
        val shardId = getShardIdFromGuildId(guildId, foxy.config.discord.totalShards)
        val cluster = getClusterByShardId(foxy, shardId)

        return if (cluster.id == foxy.currentCluster.id) {
            foxy.shardManager.getGuildById(guildId)?.let {
                val availableStaticEmojis = it.emojis.filter { emoji -> emoji.isAvailable && !emoji.isAnimated }
                val guildOwner = it.retrieveOwner().await()

                CustomGuildInfo(
                    id = it.idLong,
                    name = it.name,
                    icon = it.iconUrl,
                    owner = CustomGuildInfo.GuildOwner(
                        id = guildOwner.idLong,
                        username = guildOwner?.user?.name ?: "Unknown",
                        discriminator = guildOwner?.user?.discriminator ?: "0000",
                        avatar = guildOwner?.user?.effectiveAvatarUrl
                    ),
                    textChannels = it.textChannels.map { channel -> channel.name },
                    voiceChannels = it.voiceChannels.map { channel -> channel.name },
                    roles = it.roles.map { role -> role.name },
                    emojis = it.emojis.map { emoji -> emoji.name },
                    memberCount = it.memberCount,
                    boostCount = it.boostCount,
                    splashUrl = it.splashUrl,
                    shardId = getShardIdFromGuildId(it.idLong, foxy.config.discord.totalShards),
                    createdAt = it.timeCreated.toEpochSecond(),
                    joinedAt = it.selfMember.timeJoined.toEpochSecond(),
                    firstEmojis = availableStaticEmojis.take(30).map { emoji -> "<:${emoji.name}:${emoji.id}>" },
                    clusterInfo = cluster
                )
            }
        } else {
            val fetchedInfo = getFromAnotherCluster(foxy, cluster, "/api/v1/guilds/$guildId")
            if (fetchedInfo == null) {
                return null
            } else {
                return json.decodeFromString(fetchedInfo)
            }
        }
    }

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
                getFromAnotherCluster(foxy, cluster, "/api/v1/guilds/$guildId/users/$memberId/roles").let {
                    if (it == null) {
                        return emptyList()
                    } else {
                        val roles = json.decodeFromString<List<String>>(it)
                        cachedRoles.put(memberId, roles)
                        return roles
                    }
                }
            } catch (e: Exception) {
                // If user is not in the guild, return empty list
                return emptyList()
            }
        }
    }

    private suspend fun getFromAnotherCluster(
        foxy: FoxyInstance,
        cluster: FoxyConfig.Cluster,
        endpoint: String
    ): String? {
        return withContext(Dispatchers.IO) {
            logger.info { "Fetching data from ${cluster.clusterUrl}" }
            val response = foxy.httpClient.get {
                url(cluster.clusterUrl + endpoint)
                header("Content-Type", "application/json")
                header("Authorization", "Bearer ${foxy.config.others.internalApi.key}")
            }
            if (response.status != HttpStatusCode.OK) return@withContext null
            response.bodyAsText()
        }
    }

    @TestOnly
    /*
     * THIS IS A TEST METHOD
     * It is used to simulate fetching data from another cluster, but using the current cluster instead
    */
    suspend fun testGetGuildInfo(foxy: FoxyInstance, guildId: Long): CustomGuildInfo? {
        val cluster = foxy.currentCluster
        logger.warn { "Testing fetching data from $cluster" }
        val fetchedInfo = getFromAnotherCluster(foxy, cluster, "/api/v1/guilds/$guildId")
        if (fetchedInfo == null) {
            return null
        } else {
            return json.decodeFromString(fetchedInfo)
        }
    }
}