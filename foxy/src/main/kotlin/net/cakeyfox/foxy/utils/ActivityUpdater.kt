package net.cakeyfox.foxy.utils

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.ActivityUpdateRequest
import net.dv8tion.jda.api.OnlineStatus
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.entities.Activity.ActivityType
import kotlin.reflect.jvm.jvmName

class ActivityUpdater(
    val foxy: FoxyInstance
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val server = embeddedServer(Netty, port = foxy.config.activityPort) {
        install(ContentNegotiation) {
            json(
                Json {
                    prettyPrint = true
                    isLenient = true
                    coerceInputValues = true
                    ignoreUnknownKeys = true
                }
            )
        }

        routing {
            post("/status/update") {
                val request = call.receive<ActivityUpdateRequest>()
                logger.info { "Received activity update request: $request" }

                if (request.type !in 0..5) {
                    logger.error { "Invalid activity type: ${request.type}" }
                    call.respondText {
                        HttpStatusCode.BadRequest
                        "Invalid activity type: ${request.type}"
                    }
                    return@post
                }

                foxy.jda.presence.setPresence(
                    request.status?.let { OnlineStatus.fromKey(it) } ?: OnlineStatus.ONLINE,
                    Activity.of(
                        ActivityType.fromKey(request.type),
                        request.name,
                        request.url
                    )
                )

                call.respondText {
                    HttpStatusCode.OK
                    "Activity updated"
                }
            }
        }
    }

    init {
        server.start(wait = false)
    }
}