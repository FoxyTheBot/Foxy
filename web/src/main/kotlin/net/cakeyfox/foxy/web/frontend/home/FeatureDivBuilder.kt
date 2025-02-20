package net.cakeyfox.foxy.web.frontend.home

import kotlinx.html.*
import kotlinx.html.stream.createHTML
import net.cakeyfox.foxy.web.utils.Locale

class FeatureDivBuilder(private val locale: Locale) {
    fun build(): String {
        return createHTML().html {
            body {
                div(classes = "feature-card-section") {
                    h1(classes = "title") { +locale["features.letMeHelpYou"] }

                    div(classes = "ad horizontal") {
                        style =
                            "text-align: center; margin: 0 auto; max-width: 100%; height: auto; margin-top: 3%; margin-bottom: 1%;"
                        script {
                            attributes["async"] = "async"
                            src =
                                "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7726590371480649"
                            attributes["crossorigin"] = "anonymous"
                        }
                        ins(classes = "adsbygoogle") {
                            style = "display:block"
                            attributes["data-ad-client"] = "ca-pub-7726590371480649"
                            attributes["data-ad-slot"] = "9688545926"
                            attributes["data-ad-format"] = "auto"
                            attributes["data-full-width-responsive"] = "true"
                        }
                        script {
                            unsafe {
                                +"""
                                    (adsbygoogle = window.adsbygoogle || []).push({});
                                    """.trimIndent()
                            }
                        }
                    }

                    div(classes = "feature-card centralized") {
                        h2 {
                            +locale["features.iCanHelpYou"]
                        }
                        br {}
                        h2 {
                            +locale["features.alsoImEasierToUse"]
                        }
                    }

                    div(classes = "feature-card centralized") {
                        h1 {
                            style = "margin-bottom: 1.650rem"
                            +locale["features.someServers"]
                        }
                        // Get servers
                        unsafe { +ServersBuilder().build() }
                    }

                    div {
                        style =
                            "text-align: center; margin: 0 auto; max-width: 100%; height: auto; margin-top: 5%; margin-bottom: 1%;"
                        script {
                            attributes["async"] = "async"
                            src =
                                "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7726590371480649"
                            attributes["crossorigin"] = "anonymous"
                        }
                        ins(classes = "adsbygoogle") {
                            style = "display:inline-block;width:600px;height:200px"
                            attributes["data-ad-client"] = "ca-pub-7726590371480649"
                            attributes["data-ad-slot"] = "3945709430"
                        }
                        script {
                            unsafe {
                                +"""(adsbygoogle = window.adsbygoogle || []).push({});""".trimIndent()
                            }
                        }
                    }

                    div(classes = "feature-card left") {
                        div(classes = "text-container") {
                            h1 { +locale["features.funFeature"] }
                            h2 {
                                +locale["features.funFeatureDescription"]
                            }
                        }
                        img(classes = "feature-card-image") {
                            src = "/assets/images/features/entertainment.png"
                        }
                    }

                    div(classes = "feature-card right") {
                        div(classes = "text-container") {
                            h1 { +locale["features.modFeature"] }
                            h2 {
                                +locale["features.modFeatureDescription"]
                            }
                        }
                        img(classes = "feature-card-image") {
                            src = "/assets/images/features/automod.png"
                        }
                    }

                    div {
                        style =
                            "text-align: center; margin: 0 auto; max-width: 100%; height: auto; margin-top: 4%; margin-bottom: 1%;"
                        script {
                            attributes["async"] = "async"
                            src =
                                "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7726590371480649"
                            attributes["crossorigin"] = "anonymous"
                        }
                        ins(classes = "adsbygoogle") {
                            style = "display:inline-block;width:600px;height:200px"
                            attributes["data-ad-client"] = "ca-pub-7726590371480649"
                            attributes["data-ad-slot"] = "4422816610"
                        }
                        script {
                            unsafe {
                                +"""(adsbygoogle = window.adsbygoogle || []).push({});""".trimIndent()
                            }
                        }
                    }

                    div(classes = "feature-card left") {
                        div(classes = "text-container") {
                            h1 { +locale["features.profileFeature"] }
                            h2 {
                                +locale["features.profileFeatureDescription"]
                            }
                        }
                        img(classes = "feature-card-image") {
                            src = "/assets/images/features/profile.png"
                        }
                    }

                    div(classes = "feature-card right") {
                        div(classes = "text-container") {
                            h1 { +locale["features.economyFeature"] }
                            h2 {
                                +locale["features.economyFeatureDescription"]
                                +locale["features.economyRules"]
                            }
                        }
                        img(classes = "feature-card-image") {
                            src = "/assets/images/features/economy.png"
                        }
                    }

                    div(classes = "feature-card left") {
                        div(classes = "text-container") {
                            h1 { +locale["features.supportAndCommunity"] }
                            h2 {
                                +locale["features.supportAndCommunityDescription"]
                            }
                        }
                        img(classes = "feature-card-image") {
                            src = "/assets/images/features/your-server.png"
                        }
                    }

                    div(classes = "feature-card right") {
                        div(classes = "text-container") {
                            h1 { +"YourKit" }
                            h2 {
                                id = "yourkit-text"
                                unsafe {
                                    +"""
                                        YourKit supports open source projects with innovative and intelligent tools
                                        for monitoring and profiling Java and .NET applications.
                                        YourKit is the creator of <a href="https://www.yourkit.com/java/profiler/">YourKit Java Profiler</a>,
                                        <a href="https://www.yourkit.com/dotnet-profiler/">YourKit .NET Profiler</a>,
                                        and <a href="https://www.yourkit.com/youmonitor/">YourKit YouMonitor</a>.
                                        """.trimIndent()
                                }
                            }
                        }
                        img(classes = "feature-card-image") {
                            src = "https://www.yourkit.com/images/yklogo.png"
                            id = "yourkit"
                        }
                    }

                    div(classes = "footer-add") {
                        h2 { +"Gostou? Me adicione no seu servidor e divirta-se! :3" }
                        a(href = "/add") {
                            button { +"Adicionar" }
                        }
                    }
                }
            }
        }
    }
}