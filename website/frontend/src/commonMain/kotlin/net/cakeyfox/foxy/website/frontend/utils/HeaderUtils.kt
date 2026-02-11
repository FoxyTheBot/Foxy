package net.cakeyfox.foxy.website.frontend.utils

import kotlinx.html.*
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.serializable.data.website.UserSession

fun FlowContent.headerWithUser(user: UserSession?, locale: FoxyLocale) {
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
                div("entry menu-parent") {
                    a(href = "#") {
                        id = "support-header-btn"
                        unsafe {
                            +"""
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                """.trimIndent()
                        }
                        +locale["header.support"]
                    }
                }

                div("entry menu-parent") {
                    a(href = "#") {
                        id = "features-header-btn"
                        unsafe {
                            +"""
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                """.trimIndent()
                        }
                        +locale["header.features"]
                    }
                }

                div("entry premium") {
                    a(href = "/${locale.language}/premium") {
                        id = "premium"
                        +"Premium"
                    }
                }
            }

            div("right-entries") {
                if (user != null) {
                    div("entry") { a(href = "#") { id = "theme-toggle-btn" } }

                    div("entry menu-parent") {
                        a(href = "#") {
                            id = "login-header-btn"
                            img(
                                src = "https://cdn.discordapp.com/avatars/${user.userId}/${user.avatar}?size=512",
                                alt = "Avatar"
                            )
                            div {}
                            unsafe {
                                +"""
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down" width="24" height="25" viewBox="0 0 24 25"><path d="m6 9 6 6 6-6"></path></svg>
                            """.trimIndent()
                            }
                        }
                    }
                } else {
                    div("entry") { a(href = "#", classes = "logged-out") { id = "theme-toggle-btn" } }

                    div("entry") {
                        a(href = "/${locale.language}/dashboard") {
                            id = "login-button"
                            span { +locale["header.login"] }
                        }
                    }
                }
            }
        }
    }

    addExpandableMenu("support-menu", true) {
        a(href = "/${locale.language}/support", classes = "cmd-category-link") { +"Suporte" }
        a(href = "/${locale.language}/support/terms", classes = "cmd-category-link") { +"Termos de Uso" }
        a(href = "/${locale.language}/support/guidelines", classes = "cmd-category-link") { +"Regras da Comunidade" }
    }

    addExpandableMenu("features-menu", true) {
        a(href = "/${locale.language}/commands/all", classes = "cmd-category-link") { +"Ver Todos" }
        a(href = "/${locale.language}/commands/actions", classes = "cmd-category-link") { +"Roleplay" }
        a(href = "/${locale.language}/commands/economy", classes = "cmd-category-link") { +"Economia" }
        a(href = "/${locale.language}/commands/magic", classes = "cmd-category-link") { +"Mágica" }
        a(href = "/${locale.language}/commands/entertainment", classes = "cmd-category-link") { +"Diversão" }
        a(href = "/${locale.language}/commands/social", classes = "cmd-category-link") { +"Social" }
        a(href = "/${locale.language}/commands/music", classes = "cmd-category-link") { +"Música" }
        a(href = "/${locale.language}/commands/utils", classes = "cmd-category-link") { +"Utilitários" }
    }

    addExpandableMenu("dashboard-menu") {
        if (user != null) {
            div("user-info") {
                h3 { +"Olá, ${user.globalName ?: user.username}" }
            }
        }
        hr("separator")
        a(href = "/${locale.language}/dashboard", classes = "cmd-category-link") { +"Gerenciar Servidores" }
        a(href = "/${locale.language}/daily", classes = "cmd-category-link") { +"Prêmio Diário" }
        a(href = "/${locale.language}/store", classes = "cmd-category-link") { +"Loja Diária" }
        a(
            href = "/${locale.language}/dashboard/subscriptions",
            classes = "cmd-category-link"
        ) { +"Gerenciar Assinaturas" }
        hr("separator")
        a(href = "/logout", classes = "cmd-category-link") { +"Sair" }
    }

    div {
        id = "mobile__menu"
        classes = setOf("overlay")
        div("overlay__content") {
            a(href = "/${locale.language}/support") { +"Suporte" }
            a(href = "/${locale.language}/support/terms") { +"Termos de uso" }
            a(href = "/upvote") { +"Votar" }
            a(href = "/${locale.language}/premium") { +"Premium" }
            a(href = "/${locale.language}/commands") { +"Comandos" }
            if (user != null) {
                a(href = "/${locale.language}/dashboard") {
                    id = "login-button"
                    +"Dashboard"
                }
            } else {
                a(href = "/${locale.language}/dashboard") {
                    id = "login-button"
                    +"Login"
                }
            }
        }
    }
}

fun FlowContent.createExpandableOption(entryId: String, entryName: String) {
    div("entry menu-parent") {
        a(href = "#") {
            id = entryId

            +entryName
        }
    }
}

fun FlowContent.addExpandableMenu(
    menuId: String,
    isGrid: Boolean = false,
    block: DIV.() -> Unit
) {
    return div {
        id = menuId
        style = "display: none;"
        val isGrid = if (isGrid) "grid" else ""

        div("menu-wrapper $isGrid") {
            block()
        }
    }
}