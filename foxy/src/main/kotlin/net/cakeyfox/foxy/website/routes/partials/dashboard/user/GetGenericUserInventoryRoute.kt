package net.cakeyfox.foxy.website.routes.partials.dashboard.user

import frontend.htmx.partials.getBackgroundInventory
import frontend.htmx.partials.getLayoutInventoryPage
import io.ktor.server.htmx.hx
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.utils.io.ExperimentalKtorApi
import mu.KotlinLogging
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GetGenericUserInventoryRoute {
    companion object {
        val logger = KotlinLogging.logger { }
    }

    @OptIn(ExperimentalKtorApi::class)
    fun Routing.getUserBackgroundInventory(server: FoxyWebsite) {
        route("/{lang}/partials/inventory/{type}") {
            hx.get {
                val lang = call.parameters["lang"] ?: return@get
                val type = call.parameters["type"] ?: return@get
                val locale = FoxyLocale(lang)
                val session = checkSession(call, server, call.sessions.get<UserSession>()) ?: return@get
                val userData = server.foxy.database.user.getFoxyProfile(session.userId)

                try {
                    when (type) {
                        "backgrounds" -> {
                            val backgrounds = userData.userProfile.backgroundList.map { backgroundId ->
                                server.foxy.database.profile.getBackground(backgroundId)
                            }

                            respondWithPage(call) {
                                getBackgroundInventory(userData.userProfile.background, backgrounds, locale)
                            }
                        }

                        "layouts" -> {
                            val layouts = userData.userProfile.layoutList.map { layoutId ->
                                server.foxy.database.profile.getLayout(layoutId)
                            }

                            respondWithPage(call) {
                                getLayoutInventoryPage(userData.userProfile.layout, layouts, locale)
                            }
                        }
                    }
                } catch (e: Exception) {
                    logger.error(e) { "Error while getting user inventory ($type)" }
                }
            }
        }
    }
}