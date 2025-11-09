package net.cakeyfox.foxy.website.frontend.utils

import io.ktor.server.routing.RoutingCall
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import kotlinx.html.*
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.serializable.data.website.UserSession

fun FlowContent.headerWithUser(call: RoutingCall, locale: FoxyLocale) {
    val user = call.sessions.get<UserSession>()

    header {
        nav("marisa-navbar fixed") {
            attributes["data-preload-persist"] = "true"
            id = "navigation-bar"

            div("left-entries") {
                button {
                    id = "menu-open"
                    classes = setOf("mobile")
                    i("fas fa-bars") {}
                }
                button {
                    id = "menu-close"
                    classes = setOf("mobile")
                    style = "display: none;"
                    i("fas fa-times") {}
                }
                div("entry foxy-navbar-logo") {
                    a(href = "/") {
                        img(
                            src = "/assets/images/logo.png",
                            alt = "Foxy Avatar"
                        ) {}
                    }
                }
                div("entry") { a(href = "/br/support") { +locale["header.support"] } }
                div("entry") { a(href = "/br/support/terms") { +locale["header.termsOfUse"] } }
                div("entry") { a(href = Constants.UPVOTE_URL) { +locale["header.vote"] } }
                div("entry") { a(href = "/br/commands") { +locale["header.commands"] } }
                div("entry") { a(href = "/br/store") { +locale["header.store"] } }
                div("entry") { a(href = "/br/daily") { +locale["header.daily"] } }
                div("entry") {
                    a(href = "/br/premium") {
                        id = "premium"
                        +"Premium"
                    }
                }
            }

            div("right-entries") {
                if (user != null) {
                    div("entry") { a(href = "#") { id = "theme-toggle-btn" } }

                    div("entry") {
                        a(href = "/br/dashboard") {
                            id = "login-button"
                            img(
                                src = "https://cdn.discordapp.com/avatars/${user.userId}/${user.avatar}?size=512",
                                alt = "Avatar"
                            )
                            div {}
                            span {
                                +(user.globalName ?: user.username)
                            }
                        }
                    }
                } else {
                    div("entry") { a(href = "#", classes = "logged-out") { id = "theme-toggle-btn" } }

                    div("entry") {
                        a(href = "/br/dashboard") {
                            id = "login-button"
                            span { +locale["header.login"] }
                        }
                    }
                }
            }
        }
    }

    div {
        id = "mobile__menu"
        classes = setOf("overlay")
        div("overlay__content") {
            a(href = "/br/support") { +"Suporte" }
            a(href = "/br/support/terms") { +"Termos de uso" }
            a(href = "/upvote") { +"Votar" }
            a(href = "/br/premium") { +"Premium" }
            a(href = "/br/commands") { +"Comandos" }
            if (user != null) {
                a(href = "/br/dashboard") {
                    id = "login-button"
                    +"Dashboard"
                }
            } else {
                a(href = "/br/dashboard") {
                    id = "login-button"
                    +"Login"
                }
            }
        }
    }
}