package net.cakeyfox.foxy.web.frontend.global

import kotlinx.html.*
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.Constants

class BaseHeadBuilder {
    fun build(): String {
        return createHTML().html {
            body {
                link {
                    rel = "canonical"
                    href = Constants.FOXY_WEBSITE
                }

                meta(charset = "UTF-8")
                meta {
                    httpEquiv = "X-UA-Compatible"
                    content = "IE=edge"
                }
                meta {
                    name = "viewport"
                    content = "width=device-width, initial-scale=1.0"
                }
                link(rel = "icon", href = "/assets/images/foxycake.png")

                script {
                    attributes["async"] = "async"
                    src =
                        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7726590371480649"
                    crossorigin = ScriptCrossorigin.anonymous
                }
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