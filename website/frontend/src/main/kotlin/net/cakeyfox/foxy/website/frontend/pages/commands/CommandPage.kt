package net.cakeyfox.foxy.website.frontend.pages.commands

import io.ktor.server.routing.RoutingCall
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import kotlinx.html.body
import kotlinx.html.h1
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.main
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.getLanguage
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.UserSession

fun commandPage(call: RoutingCall, isProduction: Boolean): String {
    return createHTML().html {
        val locale = getLanguage(call)

        head {
            buildHead(
                "Foxy | Comandos",
                "Veja minhas funcionalidades",
            )
        }

        body {
            headerWithUser(call, locale)

            main("commands-page") {
                h1("commands-title") { +"Comandos" }

                buildAd(false, isProduction)


            }
        }
    }
}