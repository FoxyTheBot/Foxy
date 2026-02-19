package net.cakeyfox.foxy.website.routes.dashboard

import frontend.pages.dashboard.getModuleConfig
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.RoutingContext
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.common.checkUserPermissions
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession

class GetGenericServerModuleRoute(val server: FoxyWebsite) : BaseRoute("/servers/{guildId}/{module}") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val isProduction = server.isProduction
        val moduleId = context.call.parameters["module"] ?: return

        val (user, guild, session, guildInfo, authorizedGuilds) = checkPermissions(server, context, locale, context.call) ?: return

        respondWithPage(context.call) {
            getModuleConfig(session, moduleId, guildInfo, false, locale, isProduction, authorizedGuilds)
        }
    }

}