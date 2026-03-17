package net.cakeyfox.foxy.internal.routes

import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.delay
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
            val relayed = call.request.queryParameters["relayed"] == "true"

            logger.info { "Received activity update request: $request (relayed=$relayed)" }

            foxy.shardManager.setStatus(OnlineStatus.fromKey(request.status))

            foxy.shardManager.setActivity(
                Activity.of(
                    when (request.isStreaming) {
                        true -> ActivityType.STREAMING
                        false -> ActivityType.CUSTOM_STATUS
                    },
                    request.name,
                    request.url
                )
            )

            if (!relayed && foxy.currentCluster.isMasterCluster) {
                logger.info { "Relaying activity update to other clusters" }

                val clusters = foxy.config.discord.clusters
                    .filter { !it.isMasterCluster }

                for (cluster in clusters) {
                    delay(1_000)

                    foxy.http.post("${cluster.clusterUrl}/api/v1/status/update?relayed=true") {
                        contentType(ContentType.Application.Json)
                        setBody(request)
                    }
                }
            }

            call.respond(HttpStatusCode.OK, "Activity updated")
        }
    }
}