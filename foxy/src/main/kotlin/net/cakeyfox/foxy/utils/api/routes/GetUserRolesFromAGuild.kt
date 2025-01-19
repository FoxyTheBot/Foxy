package net.cakeyfox.foxy.utils.api.routes

import dev.minn.jda.ktx.coroutines.await
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.cakeyfox.foxy.FoxyInstance

class GetUserRolesFromAGuild {
    fun Route.getUserRolesFromAGuild(foxy: FoxyInstance) {
        get("/api/v1/guilds/{guildId}/users/{userId}/roles") {
            val guildId = call.parameters["guildId"]?.toLongOrNull()
            val userId = call.parameters["userId"]?.toLongOrNull()

            if (guildId == null || userId == null) {
                call.respond(HttpStatusCode.BadRequest, null)
                return@get
            }

            val guild = foxy.shardManager.getGuildById(guildId) ?: run {
                call.respond(HttpStatusCode.NotFound, null)
                return@get
            }

            val member = try {
                guild.retrieveMemberById(userId).await()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.NotFound, null)
                return@get
            }

            val roles = member.roles.map { it.idLong }

            call.respondText(
                text = roles.toString(),
                ContentType.Application.Json,
                status = HttpStatusCode.OK,
            )
        }
    }
}