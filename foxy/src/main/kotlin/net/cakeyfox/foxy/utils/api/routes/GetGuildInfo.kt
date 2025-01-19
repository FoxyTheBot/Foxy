package net.cakeyfox.foxy.utils.api.routes

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.cakeyfox.foxy.FoxyInstance

class GetGuildInfo {
    fun Route.getGuildInfo(foxy: FoxyInstance) {
        get("/api/v1/guilds/{guildId}") {
            val guildId = call.parameters["guildId"]?.toLongOrNull()
            if (guildId == null) {
                call.respond(HttpStatusCode.BadRequest, null)
                return@get
            }

            val guild = foxy.shardManager.getGuildById(guildId) ?: run {
                call.respond(HttpStatusCode.NotFound, null)
                return@get
            }

            call.respondText(
                text = """
                    {
                        "id": ${guild.id},
                        "name": "${guild.name}",
                        "iconUrl": "${guild.iconUrl}",
                        "memberCount": ${guild.memberCount},
                        "ownerId": ${guild.ownerId}
                    }
                """.trimIndent(),
                ContentType.Application.Json,
                status = HttpStatusCode.OK,
            )
        }
    }
}