package net.cakeyfox.foxy.web.routes

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.cakeyfox.foxy.web.frontend.info.SupportPageBuilder
import net.cakeyfox.foxy.web.utils.Locale

class SupportPageRoute {
    fun Route.supportPage(path: String) {
        get(path) {
            val locale = Locale(call.parameters["lang"] ?: "br")

            call.respondText(contentType = ContentType.Text.Html) {
                SupportPageBuilder(locale).build()
            }
        }
    }
}