package net.cakeyfox.foxy.utils.api.routes

import dev.minn.jda.ktx.coroutines.await
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.FoxyInstance

class GetUserFromGuild {
    fun Route.getUserFromGuild(foxy: FoxyInstance) {
        get("/api/v1/guilds/{guildId}/{memberId}") {
            val guildId = call.parameters["guildId"]?.toLongOrNull()
            val memberId = call.parameters["memberId"]?.toLongOrNull()

            if (guildId == null || memberId == null) {
                call.respond(HttpStatusCode.BadRequest, null)
                return@get
            }

            val guild = foxy.shardManager.getGuildById(guildId) ?: run {
                call.respond(HttpStatusCode.NotFound, null)
                return@get
            }

            val member = try {
                guild.retrieveMemberById(memberId).await()
                true
            } catch (_: Exception) {
                false
            }

            val status = buildJsonObject {
               put("isMember", member)
            }

            call.respondText(
                contentType = ContentType.Application.Json,
                text = Json.encodeToString(status)
            )
        }
    }
}