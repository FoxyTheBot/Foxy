package net.cakeyfox.foxy.web.routes

import net.cakeyfox.foxy.web.frontend.home.HomePageBuilder
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.cakeyfox.foxy.web.utils.Locale

class HomePageRoute {
    fun Route.homePage(path: String) {
        get(path) {
            val locale = Locale(call.parameters["lang"] ?: "br")

            call.respondText(contentType = ContentType.Text.Html) {
                HomePageBuilder(locale).build()
            }
        }
    }
}