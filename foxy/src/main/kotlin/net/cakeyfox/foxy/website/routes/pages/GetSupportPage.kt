package net.cakeyfox.foxy.website.routes.pages

import io.ktor.server.routing.RoutingContext
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage

class GetSupportPage(val server: FoxyWebsite) : BaseRoute("/support") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        TODO("Implement this")
    }
}