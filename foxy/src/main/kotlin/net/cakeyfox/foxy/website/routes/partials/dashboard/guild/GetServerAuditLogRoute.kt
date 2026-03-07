package net.cakeyfox.foxy.website.routes.partials.dashboard.guild

import frontend.htmx.partials.renderAuditLog
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

class GetServerAuditLogRoute {
    @OptIn(ExperimentalKtorApi::class)
    fun Routing.getServerAuditLogRoute(server: FoxyWebsite) {
        route("/{lang}/partials/{guildId}/logs") {
            hx.get {
                val guildId = call.parameters["guildId"] ?: return@get
                checkSession(call, server, call.sessions.get<UserSession>()) ?: return@get
                val lang = call.parameters["lang"] ?: return@get
                val locale = FoxyLocale(lang)
                val guild = server.foxy.database.guild.getGuildOrNull(guildId)!!

                try {

                    respondWithPage(call) {
                        renderAuditLog(
                            locale,
                            guild.dashboardLogs
                        )
                    }
                } catch (e: Exception) {
                    println(e.message)
                }
            }
        }
    }
}