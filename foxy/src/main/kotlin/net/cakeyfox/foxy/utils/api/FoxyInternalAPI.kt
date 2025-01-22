package net.cakeyfox.foxy.utils.api

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.api.routes.GetGuildInfo
import net.cakeyfox.foxy.utils.api.routes.GetGuildsFromCluster
import net.cakeyfox.foxy.utils.api.routes.GetUserRolesFromAGuild
import java.io.File

class FoxyInternalAPI(
    val foxy: FoxyInstance
) {
    init {
        embeddedServer(Netty, port = foxy.config.others.statsSenderPort) {
            install(ContentNegotiation) {
                json()
            }

            install(Authentication) {
                bearer("auth-bearer") {
                    authenticate { tokenCredential ->
                        if (tokenCredential.token == foxy.config.others.internalApi.key) {
                            UserIdPrincipal("authenticatedUser")
                        } else {
                            null
                        }
                    }
                }
            }

            routing {
                get("/") {
                    call.respondRedirect(Constants.FOXY_WEBSITE)
                }
                authenticate("auth-bearer") {
                    GetGuildsFromCluster().apply { getGuildsFromCluster(foxy) }
                    GetGuildInfo().apply { getGuildInfo(foxy) }
                    GetUserRolesFromAGuild().apply { getUserRolesFromAGuild(foxy) }
                }

                staticFiles("/assets", File("foxy/src/main/resources/profile"))
            }
        }.start(wait = false)
    }
}