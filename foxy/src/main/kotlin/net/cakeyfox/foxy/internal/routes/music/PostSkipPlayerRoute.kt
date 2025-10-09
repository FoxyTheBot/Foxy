package net.cakeyfox.foxy.internal.routes.music

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receiveText
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.website.WebplayerUser

class PostSkipPlayerRoute {
    fun Route.postSkipPlayer(foxy: FoxyInstance) {
        post("/api/v1/guilds/{guildId}/music/playback/skip") {
            val guildId = call.parameters["guildId"] ?: return@post call.respondText(
                "Missing guildId parameter",
                status = HttpStatusCode.BadRequest
            )

            val bodyAsText = call.receiveText()
            val body = foxy.json.decodeFromString<WebplayerUser>(bodyAsText)

            if (!foxy.utils.verifyHmac(body.userId, body.signature)) {
                return@post call.respondText("Invalid signature", status = HttpStatusCode.Unauthorized)
            }

            val musicManager = foxy.musicManagers[guildId.toLong()]
                ?: return@post call.respondText(
                    "No music player found for this guild",
                    status = HttpStatusCode.NotFound
                )

            val player = musicManager.getPlayer()
            if (player?.track == null) {
                return@post call.respondText(
                    "No track is currently playing",
                    status = HttpStatusCode.BadRequest
                )
            }

            musicManager.scheduler.skipTrack()
            call.respondText("Track skipped", status = HttpStatusCode.OK)
        }
    }
}