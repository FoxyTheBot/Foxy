package net.cakeyfox.foxy.internal.routes

import dev.minn.jda.ktx.coroutines.await
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.serializer
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

            val roles = member.roles.map { it.id }
            val rolesToJSON = foxy.json.encodeToString(ListSerializer(String.serializer()), roles.map { it })
            call.respondText(
                text = rolesToJSON,
                ContentType.Application.Json,
                status = HttpStatusCode.OK,
            )
        }
    }
}