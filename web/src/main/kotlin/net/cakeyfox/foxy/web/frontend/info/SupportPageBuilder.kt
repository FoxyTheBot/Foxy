package net.cakeyfox.foxy.web.frontend.info

import kotlinx.html.*
import kotlinx.html.stream.createHTML
import net.cakeyfox.foxy.web.frontend.global.AnalyticsScripts
import net.cakeyfox.foxy.web.frontend.global.HeaderBuilder
import net.cakeyfox.foxy.web.utils.Locale

class SupportPageBuilder(private val locale: Locale) {
    private val localeKey = locale.localeKey

    fun build(): String {
        return createHTML().html {
            head {
                title { +locale["support-title"] }
                link(rel = "stylesheet", href = "/styles/readonly.css")
                link(rel = "stylesheet", href = "/styles/header.css")
                link(rel = "stylesheet", href = "/styles/invite.css")
                link(rel = "stylesheet", href = "/styles/footer.css")

                unsafe { AnalyticsScripts().build() }
            }

            body {
                unsafe { +HeaderBuilder(locale).build() }

                main {
                    h1("commands-title") {
                        +"Precisa de ajuda?"
                    }

                    h3("support-description") {
                        +"""
                            Está precisando de ajuda? Tire suas dúvidas no meu servidor de suporte, caso queira fazer um
                            apelo de ban
                        """.trimIndent()
                        a(href = "/$localeKey/support/ban-appeal") { strong { +" clique aqui" } }
                    }

                    h2("server-title") {
                        +"Servidor de suporte"
                    }

                    h3("server-description") {
                        +"""
                            Precisa de ajuda? Entre no meu servidor de suporte e tire suas dúvidas e faça novas amizades!
                        """.trimIndent()
                    }

                    unsafe { +DiscordInviteBuilder().build() }
                }
            }
        }
    }
}