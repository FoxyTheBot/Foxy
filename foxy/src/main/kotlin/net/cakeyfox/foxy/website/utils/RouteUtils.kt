package net.cakeyfox.foxy.website.utils

import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respondText
import io.ktor.server.routing.RoutingContext

object RouteUtils {
    suspend fun RoutingContext.respondWithPage(statusCode: HttpStatusCode? = null, provider: suspend () -> String) {
        call.respondText(ContentType.Text.Html, statusCode ?: HttpStatusCode.OK, provider)
    }
}