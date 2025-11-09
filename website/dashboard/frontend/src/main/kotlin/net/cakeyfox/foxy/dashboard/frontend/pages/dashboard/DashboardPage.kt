package net.cakeyfox.foxy.dashboard.frontend.pages.dashboard

import io.ktor.htmx.HxSwap
import io.ktor.htmx.html.hx
import io.ktor.server.routing.RoutingCall
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.html.body
import kotlinx.html.div
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.id
import kotlinx.html.main
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.dashboard.frontend.utils.renderDashboardSidebar
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.foxy.website.frontend.utils.isLoading
import net.cakeyfox.serializable.data.website.UserSession

@OptIn(ExperimentalKtorApi::class)
fun dashboardPage(call: RoutingCall, locale: FoxyLocale, isProduction: Boolean): String {
    return createHTML().html {
        head {
            buildHead(
                titleText = "Painel de Controle",
                description = "Customize e deixe seu servidor único!",
                url = "https://foxybot.xyz/br/dashboard",
                isDashboard = true
            )
        }
        body {
            buildAd(true, isProduction)
            headerWithUser(call, locale)
            renderDashboardSidebar(call, locale)
            main {
                id = "content"
                attributes.hx {
                    get = "/${locale.language}/partials/servers"
                    trigger = "load"
                    target = "#content"
                    swap = HxSwap.innerHtml
                }

                isLoading()
            }
        }
    }
}