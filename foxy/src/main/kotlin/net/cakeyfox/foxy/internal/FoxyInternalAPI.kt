package net.cakeyfox.foxy.internal

import net.cakeyfox.foxy.internal.routes.PostDiscordMessageToGuildRoute
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
import net.cakeyfox.foxy.internal.routes.GetClusterInfo
import net.cakeyfox.foxy.internal.routes.GetGuildInfo
import net.cakeyfox.foxy.internal.routes.GetGuildsFromCluster
import net.cakeyfox.foxy.internal.routes.GetUserAvatar
import net.cakeyfox.foxy.internal.routes.GetUserFromGuild
import net.cakeyfox.foxy.internal.routes.GetUserRolesFromAGuild
import net.cakeyfox.foxy.internal.routes.PostDiscordMessageToUserRoute
import net.cakeyfox.foxy.internal.routes.PostPubSubCallbackRoute
import net.cakeyfox.foxy.internal.routes.PostUnbanUserFromGuild
import net.cakeyfox.foxy.internal.routes.PostUpdateActivityRoute
import net.cakeyfox.foxy.internal.routes.PostUpvoteWebhookRoute
import net.cakeyfox.foxy.internal.routes.music.GetGuildPlayerStatus
import net.cakeyfox.foxy.internal.routes.music.PostPausePlayerRoute
import net.cakeyfox.foxy.internal.routes.music.PostSkipPlayerRoute

class FoxyInternalAPI(
    val foxy: FoxyInstance
) {
    private val logger = KotlinLogging.logger { }
    private val server = embeddedServer(Netty, port = foxy.config.internalApi.port) {
        install(ContentNegotiation) {
            json()
        }

        install(Authentication) {
            bearer {
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

            GetUserAvatar().apply { getUserAvatar(foxy) }
            PostPubSubCallbackRoute(foxy).apply { postYouTubeWebhook(); getYouTubeWebhook() }
            PostUpvoteWebhookRoute().apply { postUpvoteWebhook(foxy) }

            authenticate {
                PostUnbanUserFromGuild().apply { postUnbanUserFromGuild(foxy) }
                GetGuildPlayerStatus().apply { getGuildPlayerStatus(foxy) }
                PostPausePlayerRoute().apply { postPausePlayerRoute(foxy) }
                PostSkipPlayerRoute().apply { postSkipPlayer(foxy) }
                PostDiscordMessageToGuildRoute().apply { postDiscordMessageToGuildRoute(foxy) }
                PostDiscordMessageToUserRoute().apply { postDiscordMessageToUser(foxy) }
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