package net.cakeyfox.foxy.utils.analytics

import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import kotlin.reflect.jvm.jvmName

class DblStatsSender(
    val foxy: FoxyInstance
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val token = foxy.config.topgg.authorization
    private val clientId = foxy.config.discord.applicationId

    suspend fun sendStatsToTopGG(serverCount: Int): Boolean {
        return withContext(foxy.coroutineDispatcher) {
            val response = foxy.http.post("https://top.gg/api/bots/$clientId/stats") {
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