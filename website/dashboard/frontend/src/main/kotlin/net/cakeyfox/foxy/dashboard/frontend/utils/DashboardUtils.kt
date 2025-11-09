package net.cakeyfox.foxy.dashboard.frontend.utils

import io.ktor.htmx.HxSwap
import io.ktor.htmx.html.hx
import io.ktor.server.routing.RoutingCall
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.html.ButtonType
import kotlinx.html.FlowContent
import kotlinx.html.a
import kotlinx.html.body
import kotlinx.html.button
import kotlinx.html.classes
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.h2
import kotlinx.html.h3
import kotlinx.html.head
import kotlinx.html.hr
import kotlinx.html.html
import kotlinx.html.i
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.html.li
import kotlinx.html.onError
import kotlinx.html.p
import kotlinx.html.span
import kotlinx.html.stream.createHTML
import kotlinx.html.ul
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.common.checkUserPermissions
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.foxy.website.frontend.utils.isLoading
import net.cakeyfox.serializable.data.website.DiscordServer
import net.cakeyfox.serializable.data.website.UserSession

fun FlowContent.getActionWrapper(locale: FoxyLocale) {
    div("actions-wrapper") {
        h3("save-message") { +locale["dashboard.actionWrapper.saveCard"] }
        div("actions") {
            button {
                id = "saveButton"
                type = ButtonType.submit

                +locale["dashboard.actionWrapper.saveButton"]
            }
        }
    }
}

@OptIn(ExperimentalKtorApi::class)
fun buildDashboardModule(
    call: RoutingCall,
    titleText: String,
    moduleTitle: String,
    moduleDescription: String,
    guild: Guild,
    locale: FoxyLocale,
    isProduction: Boolean,
    isFoxyverseGuild: Boolean,
    partialUrl: String,
    availableGuilds: List<DiscordServer>
): String {
    return createHTML().html {
        head {
            buildHead(
                titleText = titleText,
                description = moduleDescription,
                url = "https://foxybot.xyz/br/dashboard",
                isDashboard = true
            )
        }

        body {
            buildAd(true, isProduction)
            headerWithUser(call, locale)
            renderGuildSidebar(isFoxyverseGuild, guild, locale, availableGuilds)

            div("config-wrapper") {
                h1("module-title") { +moduleTitle }
                p("module-description") { +moduleDescription }

                div("config-module-wrapper") {
                    attributes.hx {
                        get = partialUrl
                        trigger = "load"
                        target = ".config-module-wrapper"
                        swap = HxSwap.innerHtml
                    }

                    isLoading()
                }
            }
        }
    }
}

fun FlowContent.renderGuildSidebar(
    isFoxyverseGuild: Boolean,
    guild: Guild,
    locale: FoxyLocale,
    availableGuilds: List<DiscordServer>
) {
    div("left-sidebar") {
        id = "sidebar"
        val currentServer = availableGuilds.find { it.id == guild._id }!!

        div("current-guild-container") {
            val gifUrl = "https://cdn.discordapp.com/icons/${currentServer.id}/${currentServer.icon}.gif?size=128"
            val pngUrl = "https://cdn.discordapp.com/icons/${currentServer.id}/${currentServer.icon}.png?size=128"
            val defaultUrl = Constants.DISCORD_DEFAULT_AVATAR

            img(src = gifUrl) {
                classes = setOf("current-guild-icon")
                onError =
                    "this.onerror=null; this.src='${pngUrl}'; this.onerror=function(){this.src='${defaultUrl}'};"
            }

            h1(classes = "guild-sidebar-title") { +currentServer.name }
        }
        hr("separator")
        div("guild-list") {
            button {
                id = "server-select-btn"
                +"Selecione um servidor"
            }
            val authorizedGuilds = availableGuilds.filter { guild ->
                checkUserPermissions(guild.permissions)
            }

            ul("custom-select-menu") {
                authorizedGuilds.forEach { guild ->
                    li {
                        a(href = "/${locale.language}/servers/${guild.id}/general") {
                            val gifUrl = "https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif?size=128"
                            val pngUrl = "https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128"
                            val defaultUrl = Constants.DISCORD_DEFAULT_AVATAR

                            img(src = gifUrl) {
                                classes = setOf("sidebar-server-icon")
                                onError =
                                    "this.onerror=null; this.src='${pngUrl}'; this.onerror=function(){this.src='${defaultUrl}'};"

                            }

                            span { +guild.name }
                        }
                    }
                }
            }
        }

        hr("separator")
        div("entries") {
            entry(locale["dashboard.guildSidebar.backToServerList"], "/br/dashboard")
            entry(locale["dashboard.guildSidebar.generalSettings"], "/br/servers/${guild._id}/general")

            if (isFoxyverseGuild) {
                hr("separator")
                h2("section-title")
                entry(locale["dashboard.guildSidebar.manageFoxyverseGuild"], "/br/servers/${guild._id}/partnership")
            }

            separateCategory(locale["dashboard.guildSidebar.separators.modules"])
            entry(locale["dashboard.guildSidebar.welcomer"], "/br/servers/${guild._id}/welcomer")
            entry(locale["dashboard.guildSidebar.autorole"], "/br/servers/${guild._id}/autorole")
            entry(locale["dashboard.guildSidebar.inviteblocker"], "/br/servers/${guild._id}/inviteblocker")
            entry(locale["dashboard.guildSidebar.music"], "/br/servers/${guild._id}/music")

            separateCategory(locale["dashboard.guildSidebar.separators.social"])
            entry(locale["dashboard.guildSidebar.youtube"], "/br/servers/${guild._id}/youtube")

            separateCategory(locale["dashboard.guildSidebar.separators.settings"])
            entry(locale["dashboard.guildSidebar.manageKeys"], "/br/servers/${guild._id}/keys")
            entry(locale["dashboard.guildSidebar.auditLog"], "/br/servers/${guild._id}/logs")
        }
    }

    sidebarToggle()
}

fun FlowContent.renderDashboardSidebar(call: RoutingCall, locale: FoxyLocale) {
    div("left-sidebar") {
        id = "sidebar"
        hr("separator")
        div("entries") {
            h2("section-title") { +locale["dashboard.category.general"] }

            entry(locale["dashboard.entries.foxyToGo"], "/br/pocket-foxy")
            entry(locale["dashboard.entries.manageServers"], "/br/dashboard")

            separateCategory(locale["dashboard.category.yourProfile"])


            entry(locale["dashboard.entries.backgrounds"], "/br/user/backgrounds")
            entry(locale["dashboard.entries.layouts"], "/br/user/layouts")
            entry(locale["dashboard.entries.decorations"], "/br/user/decorations")
            entry(locale["dashboard.entries.manageSubscriptions"], "/br/dashboard/subscriptions")

            separateCategory(locale["dashboard.category.foxyStore"])

            entry(locale["dashboard.entries.buyPremium"], "/br/premium")
            entry(locale["dashboard.entries.buyCakes"], "/br/premium")
            hr("separator")
            entry(locale["dashboard.entries.logout"], "/logout")
        }
    }

    sidebarToggle()
}

private fun FlowContent.sidebarToggle() {
    button(classes = "sidebar-toggle") {
        id = "sidebar-toggle"
        i("fas fa-bars")
    }
}

private fun FlowContent.separateCategory(title: String) {
    hr("separator")
    h2("section-title") { +title }
}

private fun FlowContent.entry(title: String, endpoint: String) {
    a(href = endpoint) {
        div("entry") { +title }
    }
}