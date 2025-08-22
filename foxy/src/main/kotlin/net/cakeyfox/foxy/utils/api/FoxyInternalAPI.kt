package net.cakeyfox.foxy.utils.api

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.api.routes.*

class FoxyInternalAPI(
    val foxy: FoxyInstance
) {
    private val logger = KotlinLogging.logger { }
    private val server = embeddedServer(Netty, port = foxy.config.internalApi.port) {
        install(ContentNegotiation) {
            json()
        }

        install(Authentication) {
            bearer("auth-bearer") {
                authenticate { tokenCredential ->
                    if (tokenCredential.token == foxy.config.internalApi.key) {
                        UserIdPrincipal("authenticatedUser")
                    } else null
                }
            }
        }

        routing {
            get("/") {
                call.respondRedirect(Constants.FOXY_WEBSITE)
            }

            get("/health") {
                call.respondText("OK")
            }

            YouTubeWebhook(foxy).apply { postYouTubeWebhook(); getYouTubeWebhook() }
            GetUserAvatar().apply { getUserAvatar(foxy) }
            PostUpvoteWebhookRoute().apply { postUpvoteWebhook(foxy) }

            authenticate("auth-bearer") {
                GetGuildsFromCluster().apply { getGuildsFromCluster(foxy) }
                GetGuildInfo().apply { getGuildInfo(foxy) }
                GetUserRolesFromAGuild().apply { getUserRolesFromAGuild(foxy) }
                GetClusterInfo().apply { getClusterInfo(foxy) }
                PostUpdateActivityRoute().apply { updateActivity(foxy) }
                GetUserFromGuild().apply { getUserFromGuild(foxy) }
            }
        }
    }.start(wait = false)

    fun stop() {
        server.stop()
        logger.info { "FoxyInternalAPI server stopped" }
    }
}