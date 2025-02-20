package net.cakeyfox.foxy.web.frontend.home

import kotlinx.html.*
import kotlinx.html.stream.createHTML

class ServersBuilder {
    fun build(): String {
        return createHTML().html {
            body {
                div(classes = "server-container") {
                    div(classes = "server-wrapper") {
                        a(href = "https://discord.gg/fhany", target = "_blank") {
                            title = "Servidor da Fhany"
                            div(classes = "server-card") {
                                img(classes = "server-avatar") {
                                    src = "/assets/icons/fhany.png"
                                }
                            }
                        }
                        a(href = "https://discord.gg/Q9BzXvHbpb", target = "_blank") {
                            title = "Cafeteria do Sally"
                            div(classes = "server-card") {
                                img(classes = "server-avatar") {
                                    src = "/assets/icons/sally.gif"
                                }
                            }
                        }
                        a(
                            href = "https://discord.gg/station-coffee-772182631798276158",
                            target = "_blank"
                        ) {
                            title = "Station Coffee"
                            div(classes = "server-card") {
                                img(classes = "server-avatar") {
                                    src = "/assets/icons/stationcoffee.gif"
                                }
                            }
                        }
                        a(href = "https://discord.gg/gMz858Zahf", target = "_blank") {
                            title = "Red Dead Brasil"
                            div(classes = "server-card") {
                                img(classes = "server-avatar") {
                                    src = "/assets/icons/raposas.png"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}