package net.cakeyfox.foxy.website.routes.partials.dashboard.guild

import frontend.htmx.partials.renderAuditLog
import frontend.htmx.partials.renderPartnershipDashboard
import io.ktor.server.htmx.hx
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.utils.io.ExperimentalKtorApi
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GetPartnershipDashboardRoute {
    @OptIn(ExperimentalKtorApi::class)
    fun Routing.getPartnershipRoute(server: FoxyWebsite) {
        route("/{lang}/partials/{guildId}/partnership") {
            hx.get {
                val guildId = call.parameters["guildId"] ?: return@get
                checkSession(call, server, call.sessions.get<UserSession>()) ?: return@get
                val lang = call.parameters["lang"] ?: return@get
                val locale = FoxyLocale(lang)
                val guild = server.foxy.database.guild.getFoxyverseGuildOrNull(guildId) ?: return@get

                try {

                    respondWithPage(call) {
                        renderPartnershipDashboard(locale)
                    }
                } catch (e: Exception) {
                    println(e.message)
                }
            }
        }
    }
}