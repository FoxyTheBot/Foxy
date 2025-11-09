package net.cakeyfox.foxy.website.routes.dashboard

import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.dashboard.frontend.pages.dashboard.buildPocketFoxyPage
import net.cakeyfox.foxy.dashboard.frontend.pages.dashboard.dashboardPage
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class PocketFoxyRoute {
    fun Routing.pocketFoxy(server: FoxyWebsite) {
        get("/{lang}/pocket-foxy") {
            val isAuthenticated = call.sessions.get<UserSession>() != null
            if (!isAuthenticated) call.respondRedirect("/login")

            respondWithPage { buildPocketFoxyPage(call, server.isProduction) }
        }
    }
}