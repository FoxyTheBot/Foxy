package net.cakeyfox.foxy.website.routes.dashboard

import frontend.pages.dashboard.dashboardPage
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.RoutingContext
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GetDashboardRoute(val server: FoxyWebsite) : BaseRoute("/dashboard") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val user = checkSession(context.call, server, context.call.sessions.get<UserSession>())

        if (user == null) {
            context.call.respondRedirect("/login")
            return
        }

        respondWithPage(context.call) { dashboardPage(user, locale, server.isProduction) }
    }

}