package frontend.utils

import kotlinx.html.ButtonType
import kotlinx.html.FlowContent
import kotlinx.html.InputType
import kotlinx.html.a
import kotlinx.html.br
import kotlinx.html.button
import kotlinx.html.classes
import kotlinx.html.div
import kotlinx.html.form
import kotlinx.html.h2
import kotlinx.html.hr
import kotlinx.html.i
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.html.input
import kotlinx.html.label
import kotlinx.html.li
import kotlinx.html.onError
import kotlinx.html.option
import kotlinx.html.p
import kotlinx.html.select
import kotlinx.html.span
import kotlinx.html.style
import kotlinx.html.textArea
import kotlinx.html.ul
import kotlinx.html.unsafe
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.common.checkUserPermissions
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.serializable.data.website.DiscordChannel
import net.cakeyfox.serializable.data.website.DiscordServer

fun FlowContent.renderPopUp(
    title: String,
    description: String,
    id: String,
    idempotencyKey: String,
    extraButtonBlock: kotlinx.html.DIV.() -> Unit? = { },
    body: kotlinx.html.DIV.() -> Unit
) {
    div {
        this.id = "popup"
        this.classes = setOf("popup-wrapper", "hidden")

        div("popup") {
            div("content") {
                h2("title") { +title }

                p {
                    classes = setOf("description")
                    style = "text-align: center;"

                    +description
                }
            }

            form {
                this.id = id
                this.style = "width: 100%;"
                this.attributes["data-gtm-form-interact-id"] = "0"
                this.attributes["idempotencyKey"] = idempotencyKey

                div(classes = "form-content") {
                    body()
                }

                div("popup-buttons") {
                    button(type = ButtonType.button) {
                        this.id = "cancel"
                        attributes["onclick"] = "hidePopup()"
                        classes = setOf("popup-button", "cancel")
                        +"Fechar"
                    }

                    extraButtonBlock()
                }
            }
        }
    }
}

fun FlowContent.renderGuildSidebar(
    isFoxyverseGuild: Boolean,
    guild: Guild,
    locale: FoxyLocale,
    availableGuilds: List<DiscordServer>,
    moduleId: String
) {
    div("left-sidebar") {
        id = "sidebar"
        val currentServer = availableGuilds.find { it.id == guild._id }!!

        div("guild-list") {
            button {
                id = "server-select-btn"
                +currentServer.name
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
            entry(
                locale["dashboard.guildSidebar.backToServerList"],
                "/br/dashboard",
                isSelected = moduleId == "dashboard",
                icon = Icons.BACK
            )

            entry(
                locale["dashboard.guildSidebar.generalSettings"],
                "/br/servers/${guild._id}/general",
                isSelected = moduleId == "general",
                icon = Icons.GEAR
            )

            entry(
                locale["dashboard.guildSidebar.auditLog"],
                "/br/servers/${guild._id}/logs",
                isSelected = moduleId == "logs",
                icon = Icons.LOG
            )

            if (isFoxyverseGuild) {
                hr("separator")
                h2("section-title")
                entry(
                    locale["dashboard.guildSidebar.manageFoxyverseGuild"],
                    "/br/servers/${guild._id}/partnership",
                    isSelected = moduleId == "partnership"
                )
            }

            separateCategory(locale["dashboard.guildSidebar.separators.moderation"])

            entry(
                locale["dashboard.guildSidebar.autorole"],
                "/br/servers/${guild._id}/autorole",
                isSelected = moduleId == "autorole",
                icon = Icons.AUTOROLE
            )
//            entry(
//                locale["dashboard.guildSidebar.inviteblocker"],
//                "/br/servers/${guild._id}/inviteblocker",
//                isSelected = moduleId == "inviteblocker",
//                icon = Icons.INVITEBLOCKER
//            )
//            entry(
//                locale["dashboard.guildSidebar.modlog"],
//                "/br/servers/${guild._id}/modlog",
//                isSelected = moduleId == "modlog",
//                icon = Icons.PUNISHMENTS
//            )

            entry(
                locale["dashboard.guildSidebar.serverLogs"],
                "/br/servers/${guild._id}/serverlogs",
                isSelected = moduleId == "serverlogs",
                icon = Icons.LOG
            )

            entry(
                locale["dashboard.guildSidebar.welcomer"],
                "/br/servers/${guild._id}/welcomer",
                isSelected = moduleId == "welcomer",
                icon = Icons.DOOR
            )

            separateCategory(locale["dashboard.guildSidebar.separators.social"])

            entry(
                locale["dashboard.guildSidebar.youtube"],
                "/br/servers/${guild._id}/youtube",
                isSelected = moduleId == "youtube",
                icon = Icons.YOUTUBE
            )

//            separateCategory(locale["dashboard.guildSidebar.separators.misc"])
//
//            entry(
//                locale["dashboard.guildSidebar.music"],
//                "/br/servers/${guild._id}/music",
//                isSelected = moduleId == "music",
//                icon = Icons.MUSIC
//            )

            separateCategory(locale["dashboard.guildSidebar.separators.settings"])

            entry(
                locale["dashboard.guildSidebar.manageKeys"],
                "/br/servers/${guild._id}/keys",
                isSelected = moduleId == "keys",
                icon = Icons.PREMIUM
            )

            a(href = "/logout") {
                div("entry logout") { +"Sair" }
            }
        }
    }

    sidebarToggle()
}


fun kotlinx.html.SELECT.getChannelList(channels:List<DiscordChannel>, defaultValue: String?) {
    channels.forEach { channel ->
        if (channel.id == defaultValue) {
            option {
                value = channel.id
                selected = true
                +channel.name
            }
        } else {
            option {
                value = channel.id
                +channel.name
            }
        }
    }
}

fun FlowContent.renderDashboardSidebar(locale: FoxyLocale) {
    div("left-sidebar") {
        id = "sidebar"

        div("entries") {
            h2("section-title") { +locale["dashboard.category.general"] }

            entry(locale["dashboard.entries.foxyToGo"], "/br/pocket-foxy", Icons.POCKET_FOXY)
            entry(locale["dashboard.entries.manageServers"], "/br/dashboard", Icons.GEAR)

            separateCategory(locale["dashboard.category.yourProfile"])
            entry(locale["dashboard.entries.daily"], "/br/daily", Icons.DAILY)
            entry(locale["dashboard.entries.backgrounds"], "/br/user/backgrounds", Icons.PROFILE_CUSTOMIZATION)
            entry(locale["dashboard.entries.layouts"], "/br/user/layouts", Icons.PROFILE_LAYOUT)
            entry(locale["dashboard.entries.decorations"], "/br/user/decorations", Icons.AVATAR_DECORATION)
            entry(locale["dashboard.entries.manageSubscriptions"], "/br/dashboard/subscriptions", Icons.MANAGE_SUBSCRIPTIONS)

            separateCategory(locale["dashboard.category.foxyStore"])
            entry(locale["dashboard.entries.dailyStore"], "/br/store", Icons.DAILY_SHOP)
            entry(locale["dashboard.entries.buyPremium"], "/br/premium", Icons.PREMIUM)

            separateCategory(locale["dashboard.category.settings"])
            entry(locale["dashboard.entries.termsOfUse"], "/br/support/terms", Icons.TOS)
            entry(locale["dashboard.entries.guidelines"], "/br/support/guidelines", Icons.TOS)
            entry(locale["dashboard.entries.deleteAccount"], "/br/dashboard/account/delete", Icons.DELETE_ACC)
            a(href = "/logout") {
                div("entry logout") { +"Sair" }
            }
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

private fun FlowContent.entry(
    title: String,
    endpoint: String,
    icon: String = "",
    isSelected: Boolean = false
) {
    val selected = if (isSelected) "selected" else ""

    a(href = endpoint) {
        div("entry $selected") {
            unsafe { +icon }
            +title
        }
    }
}