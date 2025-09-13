package net.cakeyfox.foxy.internal.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.cluster.ActivityUpdateRequest
import net.dv8tion.jda.api.OnlineStatus
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.entities.Activity.ActivityType

class PostUpdateActivityRoute {
    private val logger = KotlinLogging.logger { }

    fun Route.updateActivity(foxy: FoxyInstance) {
        post("/api/v1/status/update") {
            val request = call.receive<ActivityUpdateRequest>()
            logger.info { "Received activity update request: $request" }

            if (request.type !in 0..5) {
                logger.error { "Invalid activity type: ${request.type}" }
                call.respond(HttpStatusCode.BadRequest, "Invalid activity type: ${request.type}")
                return@post
            }

            foxy.shardManager.setStatus(OnlineStatus.fromKey(request.status))
            foxy.shardManager.setActivity(
                Activity.of(
                    ActivityType.fromKey(request.type),
                    request.name,
                    request.url
                )
            )
            call.respond(HttpStatusCode.OK, "Activity updated")
        }
    }
}