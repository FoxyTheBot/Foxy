package net.cakeyfox.foxy.website.routes.partials.dashboard.guild

import frontend.htmx.partials.renderServerListPage
import io.ktor.client.HttpClient
import io.ktor.server.htmx.hx
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.serialization.json.Json
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.getUserGuilds
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GetServerListPartial {
    private val json = Json { ignoreUnknownKeys = true }
    @OptIn(ExperimentalKtorApi::class)
    fun Route.getServerList(server: FoxyWebsite, httpClient: HttpClient) {
        route("/{lang}/partials/servers") {
            hx.get {
                val session = checkSession(call, server, call.sessions.get<UserSession>()) ?: return@get
                val lang = call.parameters["lang"] ?: return@get
                val locale = FoxyLocale(lang)
                val guilds = getUserGuilds(server, session, httpClient, call) ?: return@get

                try {
                    respondWithPage(call) {
                        renderServerListPage(guilds, locale)
                    }
                } catch (e: Exception) {
                    println(e.message)
                }
            }
        }
    }
}