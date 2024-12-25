package net.cakeyfox.foxy.utils.analytics

import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.http.content.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.analytics.utils.StatsSender
import net.cakeyfox.serializable.data.TopggBotStats
import kotlin.reflect.jvm.jvmName

class TopggStatsSender(
    val foxy: FoxyInstance
): StatsSender {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val token = foxy.config.get("dbl_token")
    private val clientId = foxy.jda.selfUser.id

    override suspend fun send(guildCount: Long): Boolean {
        val response = foxy.httpClient.post("https://top.gg/api/bots/$clientId/stats") {
            header("Authorization", token)
            accept(ContentType.Application.Json)
            setBody(
                TextContent(Json.encodeToString(TopggBotStats(guildCount)), ContentType.Application.Json)
            )
        }

        if (response.status != HttpStatusCode.OK) {
            logger.error { "Failed to send stats to top.gg: ${response.status}" }
            return false
        }

        logger.info { "Successfully sent stats to top.gg" }
        return true
    }
}