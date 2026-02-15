package net.cakeyfox.foxy.website.frontend.pages

import kotlinx.html.ATarget
import kotlinx.html.ButtonType
import kotlinx.html.FlowContent
import kotlinx.html.a
import kotlinx.html.body
import kotlinx.html.br
import kotlinx.html.button
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.h2
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.html.main
import kotlinx.html.stream.createHTML
import kotlinx.html.style
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.footerSection
import net.cakeyfox.foxy.website.frontend.utils.getLanguage
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.UserSession

fun homePage(lang: String, user: UserSession?, isProduction: Boolean): String {
    return createHTML().html {
        val locale = getLanguage(lang)

        head {
            buildHead(
                titleText = "Um bot multiuso para o seu servidor!",
                description = "Olá, Eu sou a Foxy! Um bot multiuso para o seu servidor do Discord!",
            )
        }

        body {
            headerWithUser(user, locale)

            main {
                div("intro") {
                    img(classes = "foxy-logo") {
                        src = "/assets/images/logo.png"
                    }

                    h2("greetings-2") { +locale["website.homepage.greetings"] }
                    br()

                    a(href = "/add") {
                        button(classes = "main-buttons", type = ButtonType.button) {
                            id = "add"
                            +locale["website.homepage.addButton"]
                        }
                    }
                    a(href = "/${locale.language}/dashboard") {
                        button(classes = "main-buttons", type = ButtonType.button) {
                            +locale["website.homepage.manageGuilds"]
                        }
                    }
                    br()
                    br()
                }
            }
            img(classes = "foxy-body") {
                id = "foxy-body"
                src = "/assets/images/foxy-fullbody-whitetheme.png"
            }

            div("feature-card-section") {
                h1("title") { +locale["website.homepage.letMeHelpWithYourServer"] }

                // Feature card 1
                div("feature-card centralized") {
                    h2 {
                        +locale["website.homepage.iCanHelpYourServer"]
                    }
                    br()
                    h2 {
                        +locale["website.homepage.iAmEasyToUse"]
                    }
                }

                // Google Ad 1
                buildAd(false, isProduction)

                featureCard(
                    "left",
                    locale["website.homepage.features.fun.title"],
                    locale["website.homepage.features.fun.description"],
                    "/assets/images/features/entertainment.png"
                )
                featureCard(
                    "right",
                    locale["website.homepage.features.mod.title"],
                    locale["website.homepage.features.mod.description"],
                    "/assets/images/features/automod.png"
                )

                // Google Ad 2
                buildAd(false, isProduction)

                featureCard(
                    "left",
                    locale["website.homepage.features.custom.title"],
                    locale["website.homepage.features.custom.description"],
                    "/assets/images/features/profile.png"
                )
                featureCard(
                    "right",
                    locale["website.homepage.features.economy.title"],
                    locale["website.homepage.features.economy.description"],
                    "/assets/images/features/economy.png"
                )

                buildAd(false, isProduction)

                featureCard(
                    "left",
                    locale["website.homepage.features.music.title"],
                    locale["website.homepage.features.music.description"],
                    "/assets/images/features/music.png"
                )

                featureCard(
                    "right",
                    locale["website.homepage.support.title"],
                    locale["website.homepage.support.description"],
                    "/assets/images/features/your-server.png"
                )

                div("feature-card centralized") {
                    h1 {
                        style = "margin-bottom: 1.650rem"
                        +locale["website.homepage.someServersThatLikeMyFeatures"]
                    }
                    div("server-container") {
                        div("server-wrapper") {
                            addGuild("fhany", "fhany.png")
                            addGuild("station-coffee-772182631798276158", "stationcoffee.gif")
                            addGuild("gMz858Zahf", "raposas.png")
                            addGuild("m6mEeXxHZb", "snow.png")
                            addGuild("eXTPeabPdX", "rikagaku.png")
                            addGuild("bbBqaEBmJT", "bh.gif")
                        }
                    }
                }

                div("footer-add") {
                    h2 { +locale["website.homepage.footerAdd.title"] }
                    a(href = "/add") {
                        button { +locale["website.homepage.addButton"] }
                    }
                }
            }

            footerSection()
        }
    }
}


fun FlowContent.featureCard(position: String, title: String, description: String, imageUrl: String) {
    div("feature-card $position") {
        div("text-container") {
            h1 { +title }
            h2 { +description }
        }
        img(classes = "feature-card-image") {
            src = imageUrl
        }
    }
}

fun FlowContent.addGuild(guildInvite: String, filename: String) {
    a(href = "https://discord.gg/$guildInvite", target = ATarget.blank) {
        div("server-card") {
            img("server-avatar") {
                src = "/assets/icons/$filename"
            }
        }
    }
}