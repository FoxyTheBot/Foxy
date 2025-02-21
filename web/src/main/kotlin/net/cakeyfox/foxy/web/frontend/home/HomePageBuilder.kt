package net.cakeyfox.foxy.web.frontend.home

import kotlinx.html.*
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.web.frontend.global.BaseHeadBuilder
import net.cakeyfox.foxy.web.frontend.global.HeaderBuilder
import net.cakeyfox.foxy.web.utils.Locale

class HomePageBuilder(private val locale: Locale) {
    private val localeKey = locale.localeKey

    fun build(): String {
        return createHTML().html {
            lang = "pt-br"
            head {
                unsafe { BaseHeadBuilder().build() }

                link(rel = "stylesheet", href = "/styles/header.css", type = "text/css")
                link(rel = "stylesheet", href = "/styles/footer.css", type = "text/css")
                link(rel = "stylesheet", href = "/styles/main.css", type = "text/css")

                title { +locale["homepage-title"] }
            }
            body {
                unsafe { +HeaderBuilder(locale).build() }
                main {
                    h2(classes = "greetings") { +locale["greetings"] }
                    img(classes = "foxy-logo") {
                        src = "/assets/images/logo.png"
                    }
                    h2(classes = "greetings-2") { +locale["greetings-2"] }
                    br {}
                    a(href = Constants.INVITE_LINK) {
                        button(classes = "main-buttons", type = ButtonType.button) {
                            id = "add"
                            +locale["buttons.add"]
                        }
                    }
                    a(href = "/$localeKey/support") {
                        button(classes = "main-buttons", type = ButtonType.button) { +locale["buttons.support"] }
                    }
                    br {}
                    br {}
                }

                unsafe { +FeatureDivBuilder(locale).build() }

                style {
                    unsafe {
                        +"""
                            img#yourkit {
                              width: 13rem;
                              height: auto;
                              margin-left: 20px;
                            }
                            
                            a {
                              color: #e7385d;
                            }
                            """.trimIndent()
                    }
                }
            }
        }
    }
}
