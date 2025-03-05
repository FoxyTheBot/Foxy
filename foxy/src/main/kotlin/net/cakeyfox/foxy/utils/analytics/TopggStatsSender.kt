package net.cakeyfox.foxy.utils.analytics

import io.ktor.client.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.cluster.ClusterStats
import java.util.concurrent.TimeUnit
import kotlin.reflect.jvm.jvmName

class TopggStatsSender(
    val foxy: FoxyInstance
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val token = foxy.config.others.topggToken
    private val clientId = foxy.config.discord.applicationId
    private var statsSenderJob: Job? = null

    init {
        if (foxy.currentCluster.canPublishStats && foxy.config.environment == "production") {
            startMainClusterRoutine()
        }
    }

    private fun startMainClusterRoutine() {
        logger.info { "Running TopggStatsSender on Main Cluster" }

        statsSenderJob = CoroutineScope(Dispatchers.IO).launch {
            while (true) {
                val serverCounts = getServerCountsFromClusters()
                sendStatsToTopGG(serverCounts)
                delay(TimeUnit.HOURS.toMillis(1))
            }
        }
    }

    private suspend fun getServerCountsFromClusters(): Int {
        val client = HttpClient {
            install(ContentNegotiation) { json() }
        }
        val clusterUrls = foxy.config.discord.clusters
            .mapNotNull { if (!it.canPublishStats) it.clusterUrl else null }

        if (foxy.currentCluster.maxShard == 0 && foxy.currentCluster.minShard == 0) {
            return withContext(Dispatchers.IO) {
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
                            header("Authorization", "Bearer ${foxy.config.others.internalApi.key}")
                        })
                        Json.decodeFromString<ClusterStats>(response.bodyAsText()).serverCount
                    } catch (e: Exception) {
                        logger.error(e) { "Failed to fetch server count from $url" }
                        0
                    }
                }
            }.awaitAll()
        }

        val currentClusterCount = withContext(Dispatchers.IO) {
            foxy.shardManager.shards
                .map { it.awaitReady() }
                .sumOf { it.guilds.size }
        }

        logger.info { "Current cluster has $currentClusterCount servers." }

        val totalServerCount = currentClusterCount + otherClusterCounts.sum()
        logger.info { "Total server count: $totalServerCount" }

        return totalServerCount
    }

    private suspend fun sendStatsToTopGG(serverCount: Int): Boolean {
        return withContext(Dispatchers.IO) {
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
            logger.info { "Sending $serverCount servers to Top.gg" }
            return@withContext true
        }
    }
}