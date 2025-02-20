package net.cakeyfox.foxy.web.routes

import net.cakeyfox.foxy.web.frontend.home.HomePageBuilder
import io.ktor.http.*
import io.ktor.server.html.*
import io.ktor.server.routing.*
import kotlinx.html.unsafe
import net.cakeyfox.foxy.web.utils.Locale

class HomePageRoute {
    fun Route.homePage(path: String) {
        get(path) {
            val locale = Locale(call.parameters["lang"] ?: "br")

            call.respondHtml(HttpStatusCode.OK) {
                unsafe { +HomePageBuilder(locale).build() }
            }
        }
    }
}