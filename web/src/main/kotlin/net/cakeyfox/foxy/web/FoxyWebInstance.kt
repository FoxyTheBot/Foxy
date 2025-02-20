package net.cakeyfox.foxy.web

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.cakeyfox.foxy.web.routes.HomePageRoute
import net.cakeyfox.foxy.web.routes.SupportPageRoute

class FoxyWebInstance {
    private val server = embeddedServer(Netty, port = 3040) {
        install(ContentNegotiation) { json() }

        routing {
            get("/") { call.respondRedirect("/br/")}
            HomePageRoute().apply { homePage("/{lang}/") }
            SupportPageRoute().apply { supportPage("/{lang}/support") }

            staticResources("/assets", "assets")
            staticResources("/styles", "css")
        }
    }

    fun start() {
        server.start(wait = true)
    }
}