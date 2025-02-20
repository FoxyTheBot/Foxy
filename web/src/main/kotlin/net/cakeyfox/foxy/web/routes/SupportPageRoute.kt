package net.cakeyfox.foxy.web.routes

import io.ktor.http.*
import io.ktor.server.html.*
import io.ktor.server.routing.*
import kotlinx.html.unsafe
import net.cakeyfox.foxy.web.frontend.info.SupportPageBuilder
import net.cakeyfox.foxy.web.utils.Locale

class SupportPageRoute {
    fun Route.supportPage(path: String) {
        get(path) {
            val locale = Locale(call.parameters["lang"] ?: "br")

            call.respondHtml(HttpStatusCode.OK) {
                unsafe { +SupportPageBuilder(locale).build() }
            }
        }
    }
}