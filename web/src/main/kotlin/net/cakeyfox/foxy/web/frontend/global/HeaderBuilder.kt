package net.cakeyfox.foxy.web.frontend.global

import kotlinx.html.*
import kotlinx.html.stream.createHTML
import net.cakeyfox.foxy.web.utils.Locale

class HeaderBuilder(private val locale: Locale) {
    fun build(): String {
        val localeKey = locale.localeKey
        return createHTML().html {
            head {
                link(rel = "stylesheet", href = "/styles/header.css")
                link {
                    href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                    rel = "stylesheet"
                }
            }

            body {
                header {
                    nav("marisa-navbar fixed") {
                        id = "navigation-bar"

                        div("left-entries") {
                            button {
                                id = "menu-open"
                                classes = setOf("mobile")

                                i("fas fa-bars")
                            }

                            button {
                                id = "menu-close"
                                classes = setOf("mobile")
                                style = "display: none;"

                                i("fas fa-times")
                            }

                            div("entry foxy-navbar-logo") {
                                a("/$localeKey/") {
                                    img {
                                        src = "/assets/images/FoxyAvatar.png"

                                        style =
                                            "line-height: 0px; width: 40px; height: 40px; position: absolute; top: 3px; border-radius: 100%;"

                                    }
                                }
                            }

                            div("entry") { a("/$localeKey/support") { +locale["entries.support"] } }
                            div("entry") { a("/$localeKey/status") { +locale["entries.status"] } }
                            div("entry") { a("/$localeKey/support/terms") { +locale["entries.termsOfUse"] } }
                            div("entry") { a("/upvote") { +locale["entries.upvote"] } }
                            div("entry") { a("/$localeKey/premium") { +locale["entries.premium"] } }
                            div("entry") { a("/$localeKey/commands") { +locale["entries.commands"] } }
                            div("entry") { a("/$localeKey/store") { +locale["entries.dailyShop"] } }
                            div("entry") { a("/$localeKey/daily") { +locale["entries.daily"] } }
                        }

                        div("right-entries") {
                            div("entry") {
                                a("/$localeKey/dashboard") {
                                    id = "login-button"
                                    span { +"Login" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}