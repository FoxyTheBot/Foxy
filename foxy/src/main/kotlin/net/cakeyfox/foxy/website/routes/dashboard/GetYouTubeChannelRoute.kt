package net.cakeyfox.foxy.website.routes.dashboard

import frontend.utils.buildDashboardModule
import io.ktor.server.response.respondRedirect
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

class GetYouTubeChannelRoute(
    val server: FoxyWebsite
) : BaseRoute("/servers/{guildId}/{module}/{channelId}") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val lang = context.call.parameters["lang"] ?: return
        val module = context.call.parameters["module"] ?: return
        val channelId = context.call.parameters["channelId"] ?: return

        val locale = FoxyLocale(lang)
        try {
            val (user, guild, session, guildInfo, authorizedGuilds) = checkPermissions(server, context, locale, context.call) ?: return

            respondWithPage(context.call) {
                buildDashboardModule(
                    session = session,
                    titleText = locale["dashboard.modules.manage", locale["dashboard.modules.youtube.title"]],
                    moduleTitle = locale["dashboard.modules.youtube.title"],
                    moduleDescription = locale["dashboard.modules.youtube.description"],
                    currentGuild = guildInfo,
                    locale = locale,
                    isProduction = server.isProduction,
                    isFoxyverseGuild = false,
                    partialUrl = "/${locale.language}/partials/${guild.id}/youtube/$channelId",
                    availableGuilds = authorizedGuilds,
                    module
                )
            }
        } catch (_: Exception) {
            context.call.respondRedirect("/login")
        }
    }
}