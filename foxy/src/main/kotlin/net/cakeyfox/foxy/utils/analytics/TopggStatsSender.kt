package net.cakeyfox.foxy.utils.analytics

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.ClusterStats
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
        } else {
            startHttpServer()
        }
    }

    private fun startMainClusterRoutine() {
        logger.info { "Running TopggStatsSender on Main Cluster" }

        statsSenderJob = CoroutineScope(Dispatchers.IO).launch {
            val serverCounts = getServerCountsFromClusters()
            sendStatsToTopGG(serverCounts)
        }
    }

    private suspend fun getServerCountsFromClusters(): Int {
        val client = HttpClient()
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
                        val response = client.get(url)
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
                accept(ContentType.Application.Json)
                setBody(
                    TextContent(
                        Json.encodeToString(ClusterStats.TopggBotStats(serverCount)),
                        ContentType.Application.Json
                    )
                )
            }

            if (response.status != HttpStatusCode.OK) {
                logger.error { "Failed to send stats to top.gg: ${response.status}" }
                return@withContext false
            }
            logger.info { "Sending $serverCount servers to Top.gg" }
            return@withContext true
        }
    }

    private fun startHttpServer() {
        embeddedServer(Netty, port = foxy.config.others.statsSenderPort) {
            install(ContentNegotiation) {
                json()
            }

            routing {
                get("/guilds") {
                    val serverCount = foxy.shardManager.shards.sumOf { it.guilds.size }
                    val response = buildJsonObject {
                        put("serverCount", serverCount)
                    }
                    val jsonString = Json.encodeToString(response)
                    call.respondText(
                        contentType = ContentType.Application.Json,
                        text = jsonString
                    )
                }
            }
        }.start(wait = false)
    }
}