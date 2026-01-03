package net.cakeyfox.foxy.website.frontend.pages

import kotlinx.html.a
import kotlinx.html.body
import kotlinx.html.classes
import kotlinx.html.div
import kotlinx.html.h2
import kotlinx.html.head
import kotlinx.html.h1
import kotlinx.html.h3
import kotlinx.html.html
import kotlinx.html.li
import kotlinx.html.main
import kotlinx.html.stream.createHTML
import kotlinx.html.style
import kotlinx.html.ul
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.getLanguage
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.UserSession

fun termsOfServicePage(user: UserSession?, lang: String): String {
    return createHTML().html {
        val locale = getLanguage(lang)

        head {
            buildHead(
                titleText = "Termos de Uso",
                description = "Não existe paz sem ordem, não é mesmo? Então leia os termos de uso para evitar fazer coisa errada e ser punido por isso!"
            )
        }

        body {
            headerWithUser(user, locale)

            main(classes = "foxy-tos-wrapper") {
                div("tos-container") {

                    a {
                        href = "#tos"
                        h1("foxy-tos-title") {
                            +"Terms of Service and Privacy Policy"
                        }
                    }

                    h3("foxy-tos-description") {
                        +"Last updated on: November 19, 2023"
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Introduction and Acceptance of Terms" }

                        h3("foxy-tos-description") {
                            +"""
                        These Terms of Service ("terms"), which include and hereby incorporate the Privacy Policy
                        at foxybot.xyz/terms or foxybot.xyz/privacy ("Privacy Policy"), are a legal agreement
                        between Foxy and its creator ("WinG4merBR" or "we"). By using Foxy (the "Bot") or the
                        website located at https://foxybot.xyz, collectively referred to as the "Service", you agree (i)
                        that you are 13 years of age or older, (ii) if you are of legal age in your jurisdiction or older,
                        that you have read, understood and agree to be bound by the terms, and (iii) if you are between
                        13 and the age of majority in your jurisdiction, that your legal guardian has reviewed and
                        agrees to these terms.

                        We reserve the right, at our discretion, to change, add, or remove portions or revise these terms
                        at any time, and you agree to be bound by such modifications or revisions. Any changes or
                        modifications will become effective five (5) days after being posted on the Service, and your
                        continued use of the Service after the effective date will constitute your acceptance of such
                        changes.

                        This document applies to Foxy ("FoxyBot", "Foxy Discord Bot", "FoxyDBot", "bot", "our bot").
                        By using our bots, you agree to be bound by this agreement.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Service Usage Rights" }

                        h3("foxy-tos-description") {
                            +"""
                        The Service provides an extension to the Discord mobile chat platform. Subject to your
                        compliance with these terms, the Service grants you a limited, revocable, non-exclusive,
                        non-transferable, non-sublicensable license for personal, non-commercial use.

                        You agree not to use the Service for unauthorized purposes, not to copy or distribute it,
                        and accept that the creator may modify, suspend, or terminate your account at any time
                        without notice.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Fees" }

                        h3("foxy-tos-description") {
                            +"""
                        Basic functionality is free, but some features or Virtual Goods may require payment.
                        Prices will be displayed in the App or Bot, and handled by third-party payment providers.
                        You are responsible for applicable taxes.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Your Content" }

                        h3("foxy-tos-description") {
                            +"""
                        Any data, text, or materials uploaded by you are "Your Content". You guarantee that you
                        own all rights to it.

                        By uploading, you grant us a perpetual, royalty-free, worldwide license to use, modify,
                        distribute, and display Your Content.

                        The Service is not responsible for user content and may remove Your Content at any time.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Stored Content" }

                        h3("foxy-tos-description") {
                            ul {
                                li { +"Executed Commands: stored for usage metrics and security." }
                                li { +"Your User ID: used to create your Foxy profile." }
                                li { +"Your Server ID: stored to provide moderation commands." }
                            }
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Content We Access but Do Not Store" }

                        h3("foxy-tos-description") {
                            ul {
                                li { +"Roles and Channels: required for auto-mod features, customizable by you." }
                                li { +"Message Content: accessed but never stored; only used when necessary." }
                            }
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Cookies" }

                        h3("foxy-tos-description") {
                            +"We use cookies to determine login state so you can access the Foxy dashboard."
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Virtual Currency and Virtual Goods" }

                        h3("foxy-tos-description") {
                            +"""
                        The Service may provide Virtual Currency or Virtual Goods. Purchases are final, non-refundable,
                        and non-transferable. Unauthorized trading is prohibited and may lead to account termination.

                        We reserve the right to modify or remove Virtual Goods at any time.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Data Administration" }

                        h3("foxy-tos-description") {
                            +"""
                        All data may be accessed only by Vitor (WinG4merBR – 687867247116812378),
                        who agrees not to share, sell, or distribute data except to Discord or authorities when required.

                        We may contact authorities or Discord if necessary.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Deletion of Your Information" }

                        h3("foxy-tos-description") {
                            +"""
                        You can delete your Foxy account through the website by selecting "delete account".
                        To delete server data, simply remove Foxy from your server.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Intellectual Property Rights" }

                        h3("foxy-tos-description") {
                            +"""
                        The name "Foxy" is free to use publicly, but images are owned by the Service and
                        require permission from WinG4merBR for use, with proper credit.

                        The code is licensed under AGPL-3.0; modifications must remain public and credit must be given.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Disclaimer of Warranty" }

                        h3("foxy-tos-description") {
                            +"""
                        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, INCLUDING IMPLIED
                        WARRANTIES OF MERCHANTABILITY OR FITNESS. WE DO NOT GUARANTEE ERROR-FREE
                        OR UNINTERRUPTED OPERATION.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Limitation of Liability" }

                        h3("foxy-tos-description") {
                            +"""
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR INDIRECT OR
                        CONSEQUENTIAL DAMAGES. LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE
                        LAST 3 MONTHS OR $100.
                        """.trimIndent()
                        }
                    }

                    div("foxy-tos-term") {
                        h2("foxy-tos-section-title") { +"Acknowledgment" }

                        h3("foxy-tos-description") {
                            +"By using our services, you acknowledge that you have read and agree to these terms."
                        }
                    }
                }
            }
        }
    }
}