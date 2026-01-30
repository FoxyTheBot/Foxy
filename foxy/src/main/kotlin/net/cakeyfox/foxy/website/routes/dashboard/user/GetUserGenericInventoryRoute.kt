package net.cakeyfox.foxy.website.routes.dashboard.user

import frontend.pages.dashboard.getInventoryPage
import frontend.pages.dashboard.getModuleConfig
import io.ktor.server.routing.RoutingContext
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GetUserGenericInventoryRoute(val server: FoxyWebsite) : BaseRoute("/user/{inventory}") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val isProduction = server.isProduction
        val inventory = context.call.parameters["inventory"] ?: return
        val session = checkSession(context.call, server, context.call.sessions.get<UserSession>())

        respondWithPage(context.call) {
            getInventoryPage(session, locale, isProduction, inventory)
        }
    }
}