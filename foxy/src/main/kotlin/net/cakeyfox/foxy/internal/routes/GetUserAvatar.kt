package net.cakeyfox.foxy.internal.routes

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

class GetUserAvatar() {
    fun Route.getUserAvatar(foxy: FoxyInstance) {
        get("/user/{id}/avatar") {
            val userId = call.parameters["id"]?.toLongOrNull()

            if (userId == null) {
                call.respond(HttpStatusCode.BadRequest, "Missing user ID")
                return@get
            }

            val avatar = foxy.shardManager.retrieveUserById(userId).await().effectiveAvatarUrl

            val avatarUrl = buildJsonObject {
                put("url", avatar)
            }

            call.respondText(contentType = ContentType.Text.Plain) {
                Json.encodeToString(avatarUrl)
            }
        }
    }
}