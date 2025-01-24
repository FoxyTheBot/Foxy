package net.cakeyfox.foxy.utils.api.routes

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.*
import net.cakeyfox.foxy.FoxyInstance
import java.lang.management.ManagementFactory

class GetClusterInfo {
    fun Route.getClusterInfo(foxy: FoxyInstance) {
        get("/api/v1/info") {
            val currentCluster = foxy.currentCluster
            val runtime = Runtime.getRuntime()
            val usedMemory = (runtime.totalMemory() - runtime.freeMemory()) / 1024 / 1024
            val maxMemory = runtime.maxMemory() / 1024 / 1024
            val freeMemory = runtime.freeMemory() / 1024 / 1024
            val totalMemory = runtime.totalMemory() / 1024 / 1024

            val clusterInfo = buildJsonObject {
                put("id", currentCluster.id)
                put("name", currentCluster.name)
                putJsonObject("versions") {
                    put("kotlin", KotlinVersion.CURRENT.toString())
                    put("java", System.getProperty("java.version"))
                }
                put("threadCount", Thread.activeCount())
                put("shardCount", foxy.shardManager.shards.size)
                put("guildCount", foxy.shardManager.shards.sumOf { it.guilds.size })
                put("ping", foxy.shardManager.averageGatewayPing)
                put("minShard", currentCluster.minShard)
                put("maxShard", currentCluster.maxShard)
                put("uptime", ManagementFactory.getRuntimeMXBean().uptime)
                putJsonObject("memory") {
                    put("used", usedMemory)
                    put("max", maxMemory)
                    put("free", freeMemory)
                    put("total", totalMemory)
                }
                putJsonArray("shards") {
                    for (shard in foxy.shardManager.shards.sortedBy { it.shardInfo.shardId }) {
                        addJsonObject {
                            put("id", shard.shardInfo.shardId)
                            put("ping", shard.gatewayPing)
                            put("status", shard.status.toString())
                            put("guildCount", shard.guildCache.size())
                        }
                    }
                }
            }

            call.respondText(
                text = clusterInfo.toString(),
                contentType = ContentType.Application.Json
            )
        }
    }
}