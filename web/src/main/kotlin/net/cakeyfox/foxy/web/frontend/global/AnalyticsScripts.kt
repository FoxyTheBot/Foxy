package net.cakeyfox.foxy.web.frontend.global

import kotlinx.html.*
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.Constants

class AnalyticsScripts {
    fun build(): String {
        return createHTML().html {
            body {
                link(rel = "canonical", href = Constants.FOXY_WEBSITE)

                script {
                    attributes["async"] = "async"
                    src = "https://www.googletagmanager.com/gtag/js?id=G-E3J7N4BP8L"
                }
                script {
                    unsafe {
                        +"""
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-E3J7N4BP8L');
                            """.trimIndent()
                    }
                }
            }
        }
    }
}