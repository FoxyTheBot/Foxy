package net.cakeyfox.foxy.utils.analytics

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.cluster.ClusterStats
import java.util.concurrent.TimeUnit
import kotlin.reflect.jvm.jvmName

class DblStatsSender(
    val foxy: FoxyInstance
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val token = foxy.config.topgg.authorization
    private val clientId = foxy.config.discord.applicationId
    private var statsSenderJob: Job? = null

    init {
        if (foxy.currentCluster.isMasterCluster && foxy.config.environment == "production") {
            startMainClusterRoutine()
        }
    }

    private fun startMainClusterRoutine() {
        logger.info { "Running TopggStatsSender on Main Cluster" }

        statsSenderJob = CoroutineScope(foxy.coroutineDispatcher).launch {
            while (true) {
                val serverCounts = getServerCountsFromClusters()
                sendStatsToTopGG(serverCounts)
                delay(TimeUnit.HOURS.toMillis(2))
            }
        }
    }

    private suspend fun getServerCountsFromClusters(): Int {
        val client = foxy.httpClient
        val clusterUrls = foxy.config.discord.clusters
            .mapNotNull { if (!it.isMasterCluster) it.clusterUrl else null }

        if (foxy.currentCluster.maxShard == 0 && foxy.currentCluster.minShard == 0) {
            return withContext(foxy.coroutineDispatcher) {
                foxy.shardManager.shards
                    .map { it.awaitReady() }
                    .sumOf { it.guilds.size }
            }
        }

        val otherClusterCounts = coroutineScope {
            clusterUrls.map { url ->
                async {
                    try {
                        val response = client.get("$url/guilds", {
                            header("Authorization", "Bearer ${foxy.config.internalApi.key}")
                        })
                        Json.decodeFromString<ClusterStats>(response.bodyAsText()).serverCount
                    } catch (e: Exception) {
                        logger.error(e) { "Failed to fetch server count from $url" }
                        0
                    }
                }
            }.awaitAll()
        }

        val currentClusterCount = withContext(foxy.coroutineDispatcher) {
            foxy.shardManager.shards
                .map { it.awaitReady() }
                .sumOf { it.guilds.size }
        }


        val totalServerCount = currentClusterCount + otherClusterCounts.sum()
        logger.info { "Current cluster: $currentClusterCount servers | Total: $totalServerCount" }
        return totalServerCount
    }

    private suspend fun sendStatsToTopGG(serverCount: Int): Boolean {
        return withContext(foxy.coroutineDispatcher) {
            val response = foxy.httpClient.post("https://top.gg/api/bots/$clientId/stats") {
                header("Authorization", token)
                contentType(ContentType.Application.Json)
                setBody(buildJsonObject {
                    put("server_count", serverCount)
                    put("shard_count", foxy.config.discord.totalShards)
                })
            }

            if (response.status != HttpStatusCode.OK) {
                logger.error { "Failed to send stats to top.gg: ${response.status}" }
                return@withContext false
            }
            return@withContext true
        }
    }
}