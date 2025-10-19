package net.cakeyfox.foxy.internal.routes

import dev.minn.jda.ktx.coroutines.await
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receiveText
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.cluster.RelayMessage

class PostDiscordMessageToUserRoute {
    companion object {
        private val logger = KotlinLogging.logger { }
    }

    // TODO: Add thumbnail support

    fun Route.postDiscordMessageToUser(foxy: FoxyInstance) {
        post("/api/v1/users/{userId}/send") {
            val bodyAsText = call.receiveText()
            val userId = call.parameters["userId"] ?: return@post call.respond(HttpStatusCode.BadRequest)

            try {
                val payload = foxy.json.decodeFromString<RelayMessage>(bodyAsText)
                val user = foxy.shardManager.retrieveUserById(userId).await()

                foxy.utils.sendDirectMessage(user) {
                    payload.content?.let { content = it }

                    payload.embeds?.forEach { raw ->
                        embed {
                            raw.title?.let { title = it }
                            raw.description?.let { description = it }
                            raw.color?.let { color = it }
                            raw.fields?.forEach { f ->
                                field(f.name, f.value, f.inline)
                            }
                            raw.footer?.let { footer(it.text, it.icon_url) }
                        }
                    }
                }

                call.respond(HttpStatusCode.OK)
            } catch (e: Exception) {
                logger.error(e) { "Failed to send relay message" }
                return@post call.respond(HttpStatusCode.BadRequest)
            }
        }
    }
}