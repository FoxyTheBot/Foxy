package frontend.htmx.partials

import kotlinx.html.InputType
import kotlinx.html.a
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.html.input
import kotlinx.html.onError
import kotlinx.html.stream.createHTML
import kotlinx.html.unsafe
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.serializable.data.website.DiscordServer

fun renderServerListPage(guilds: List<DiscordServer>, locale: FoxyLocale): String {
    return createHTML().div(classes = "blur-wrapper") {
        div(classes = "blurred-overlay")

        div(classes = "server-list-with-searchbar") {

            div("search-wrapper") {
                input(type = InputType.text) {
                    id = "search-bar"
                    placeholder = "Buscar servidor..."
                }
            }

            div {
                id = "server-list"
                unsafe {
                    +renderServerList(guilds, locale)
                }
            }
        }
    }
}

fun renderServerList(guilds: List<DiscordServer>, locale: FoxyLocale): String {
    return createHTML().div("servers") {
        guilds.forEach { guild ->
            val gifUrl = "https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif?size=128"
            val pngUrl = "https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128"
            val defaultUrl = Constants.DISCORD_DEFAULT_AVATAR

            div("server") {
                div("server__banner") {
                    img {
                        src = gifUrl
                        alt = guild.name
                        onError =
                            "this.onerror=null; this.src='${pngUrl}'; this.onerror=function(){this.src='${defaultUrl}'};"
                    }
                }

                div("server__icon") {
                    img {
                        src = gifUrl
                        alt = guild.name
                        onError =
                            "this.onerror=null; this.src='${pngUrl}'; this.onerror=function(){this.src='${defaultUrl}'};"
                    }
                }

                div("server__info") {
                    h1 { +guild.name }
                }

                div("server__buttons") {
                    a(
                        "/br/servers/${guild.id}/general",
                        classes = "server__button"
                    ) { +locale["dashboard.guildList.manageButton"] }
                }
            }
        }
    }
}