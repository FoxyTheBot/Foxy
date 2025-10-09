package net.cakeyfox.foxy.internal.routes.music

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receiveText
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.website.WebplayerUser

class PostPausePlayerRoute {
    fun Route.postPausePlayerRoute(foxy: FoxyInstance) {
        post("/api/v1/guilds/{guildId}/music/playback/pause") {
            val guildId = call.parameters["guildId"] ?: return@post call.respondText(
                "Missing guildId parameter",
                status = HttpStatusCode.BadRequest
            )

            val bodyAsText = call.receiveText()
            val body = foxy.json.decodeFromString<WebplayerUser>(bodyAsText)
            val userId = body.userId
            val signature = body.signature

            // Check signature
            if (!foxy.utils.verifyHmac(userId, signature)) {
                return@post call.respondText("Invalid signature", status = HttpStatusCode.Unauthorized)
            }

            val player = foxy.musicManagers[guildId.toLong()]?.getPlayer()
            if (player == null) {
                call.respondText("No music player found for this guild", status = HttpStatusCode.NotFound)
                return@post
            }

            if (player.paused) {
                player.setPaused(false).subscribe()
                call.respondText("Resumed playback", status = HttpStatusCode.OK)
            } else {
                player.setPaused(true).subscribe()
                call.respondText("Paused playback", status = HttpStatusCode.OK)
            }
        }
    }
}