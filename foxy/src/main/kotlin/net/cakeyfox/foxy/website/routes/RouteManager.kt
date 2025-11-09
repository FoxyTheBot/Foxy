package net.cakeyfox.foxy.website.routes

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import kotlinx.serialization.json.Json
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.frontend.pages.commands.commandPage
import net.cakeyfox.foxy.website.routes.dashboard.DashboardRoute
import net.cakeyfox.foxy.website.routes.partials.ServerListRoute
import net.cakeyfox.foxy.website.frontend.pages.home.homePage
import net.cakeyfox.foxy.website.frontend.pages.premium.premiumPage
import net.cakeyfox.foxy.website.routes.dashboard.GenericServerConfigRoute
import net.cakeyfox.foxy.website.routes.dashboard.PocketFoxyRoute
import net.cakeyfox.foxy.website.routes.partials.GetServerSettings
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage

class RouteManager(val server: FoxyWebsite) {
    private val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    fun Routing.registerRoutes() {
        get("/") {
            call.respondRedirect("/br/")
        }

        get("/{lang}/") { respondWithPage { homePage(call, server.isProduction) } }
        get("/{lang}/premium") { respondWithPage { premiumPage(call) } }
        get("/{lang}/commands") { respondWithPage { commandPage(call, server.isProduction) } }

        GenericServerConfigRoute().apply { getServerConfigPage(server) }
        DashboardRoute().apply { getDashboardPage(server) }
        PocketFoxyRoute().apply { pocketFoxy(server) }

        // == [PARTIALS] ==
        ServerListRoute().apply { getServerList(server, httpClient) }
        GetServerSettings().apply { getServerSettings(server) }
    }
}