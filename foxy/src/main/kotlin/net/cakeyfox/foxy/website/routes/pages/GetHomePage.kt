package net.cakeyfox.foxy.website.routes.pages

import io.ktor.server.routing.RoutingContext
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.frontend.pages.homePage
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GetHomePage(val server: FoxyWebsite) : BaseRoute("/{lang}/") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val lang = context.call.parameters["lang"] ?: "br"
        val user = checkSession(context.call, server, context.call.sessions.get<UserSession>())

        respondWithPage(context.call) { homePage(lang, user, server.isProduction) }
    }
}