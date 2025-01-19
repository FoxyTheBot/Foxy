package net.cakeyfox.foxy.utils.api

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.api.routes.GetGuildInfo
import net.cakeyfox.foxy.utils.api.routes.GetGuildsFromCluster
import net.cakeyfox.foxy.utils.api.routes.GetUserRolesFromAGuild

class FoxyInternalAPI(
    val foxy: FoxyInstance
) {
    init {
        embeddedServer(Netty, port = 8080) {
            install(ContentNegotiation) {
                json()
            }

            routing {
                GetGuildsFromCluster().apply { getGuildsFromCluster(foxy) }
                GetGuildInfo().apply { getGuildInfo(foxy) }
                GetUserRolesFromAGuild().apply { getUserRolesFromAGuild(foxy) }
            }
        }.start(wait = false)
    }
}