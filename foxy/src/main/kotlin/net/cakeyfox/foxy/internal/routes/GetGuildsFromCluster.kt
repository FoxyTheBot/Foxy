package net.cakeyfox.foxy.internal.routes

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.FoxyInstance

class GetGuildsFromCluster {
    fun Route.getGuildsFromCluster(foxy: FoxyInstance) {
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
}