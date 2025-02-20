package net.cakeyfox.foxy.web.frontend.info

import kotlinx.html.*
import kotlinx.html.stream.createHTML

class DiscordInviteBuilder {
    fun build(): String {
        return createHTML().html {
            body {
                div("discord-invite-wrapper") {
                    div("discord-invite-title") { +"Você foi convidado(a) a entrar em um servidor" }
                    div("discord-server-details") {
                        div("discord-server-icon") {
                            img { src = "/assets/icons/supportserver.png" }
                        }

                        div("discord-server-info") {
                            div("discord-server-name") { +"Cafeteria da Foxy ☕" }
                        }

                        a(href = "https://discord.gg/6mG2xDtuZD", target = "_blank") {
                            classes = setOf("discord-server-button")
                            +"Juntar-se"
                        }
                    }
                }
            }
        }
    }
}