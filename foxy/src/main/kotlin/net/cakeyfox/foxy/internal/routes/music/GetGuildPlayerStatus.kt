package net.cakeyfox.foxy.internal.routes.music

import dev.minn.jda.ktx.coroutines.await
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import kotlinx.serialization.json.add
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.FoxyInstance

class GetGuildPlayerStatus {
    fun Route.getGuildPlayerStatus(foxy: FoxyInstance) {
        get("/api/v1/music/player/{guildId}/status/{userId}/") {
            val guildId = call.parameters["guildId"] ?: return@get call.respondText(
                "Missing guildId parameter",
                status = HttpStatusCode.BadRequest
            )

            val userId = call.parameters["userId"] ?: return@get call.respondText(
                "Missing userId parameter",
                status = HttpStatusCode.BadRequest
            )


            val guild = foxy.shardManager.getGuildById(guildId)!!
            val member = guild.retrieveMemberById(userId).await()
            member.voiceState?.channel ?: return@get call.respondText(
                "User is not in a voice channel",
                status = HttpStatusCode.BadRequest
            )

            val player = foxy.musicManagers[guildId.toLong()]?.getPlayer()
            if (player == null) {
                call.respondText("No music player found for this guild", status = HttpStatusCode.NotFound)
                return@get
            }
            val manager = foxy.musicManagers[guild.idLong] ?: return@get

            val tracks = manager.scheduler.queue.toList()

            val jsonBody = buildJsonObject {
                put("nowPlaying", buildJsonObject {
                    put("title", player.track?.info?.title)
                    put("url", player.track?.info?.uri)
                    put("author", player.track?.info?.author)
                    put("thumbnail", player.track?.info?.artworkUrl)
                })

                println(tracks)
                put("queue", buildJsonArray {
                    tracks.forEach {
                        add(buildJsonObject {
                            put("track", it.info.title)
                            put("author", it.info.author)
                            put("position", it.info.position)
                            put("artwork", it.info.artworkUrl)
                        })
                    }
                })
            }

            call.respondText(jsonBody.toString(), contentType = ContentType.Application.Json)
        }
    }
}