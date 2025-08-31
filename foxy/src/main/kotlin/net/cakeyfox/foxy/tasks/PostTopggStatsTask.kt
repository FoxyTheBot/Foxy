package net.cakeyfox.foxy.tasks

import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.statement.bodyAsText
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.RunnableCoroutine
import net.cakeyfox.foxy.utils.analytics.DblStatsSender
import net.cakeyfox.foxy.utils.logging.task
import net.cakeyfox.serializable.data.cluster.ClusterStats

class PostTopggStatsTask(
    val foxy: FoxyInstance
) : RunnableCoroutine {
    private val topggStatsSender = DblStatsSender(foxy)

    companion object {
        private val logger = KotlinLogging.logger { }
    }

    override suspend fun run() {
        try {
            if (foxy.currentCluster.isMasterCluster && foxy.config.environment == "production") {
                val serverCounts = getServerCountsFromClusters()
                topggStatsSender.sendStatsToTopGG(serverCounts)
            } else logger.task { "Skipping ${this::class.java.simpleName} task..." }
        } catch (e: Exception) {
            logger.error(e) { "Error while sending Top.gg stats" }
        }
    }

    private suspend fun getServerCountsFromClusters(): Int {
        val client = foxy.http
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
        logger.task { "Current cluster: $currentClusterCount servers | Total: $totalServerCount" }
        return totalServerCount
    }
}