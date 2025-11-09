package net.cakeyfox.foxy.dashboard.frontend.htmx.partials

import kotlinx.html.ButtonType
import kotlinx.html.FormMethod
import kotlinx.html.InputType
import kotlinx.html.button
import kotlinx.html.div
import kotlinx.html.form
import kotlinx.html.id
import kotlinx.html.input
import kotlinx.html.label
import kotlinx.html.option
import kotlinx.html.select
import kotlinx.html.span
import kotlinx.html.stream.createHTML
import kotlinx.html.style
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.dashboard.frontend.utils.getActionWrapper
import net.cakeyfox.foxy.database.data.guild.Guild

fun getGeneralSettings(guild: Guild, locale: FoxyLocale): String {
    return createHTML().form(classes = "config-module-form") {
        action = "/api/v1/servers/${guild._id}/modules/general"
        method = FormMethod.post

        div("config-module") {
            label("module-name") { +locale["dashboard.modules.general.changePrefix.title"] }
            div {
                input(type = InputType.text) {
                    name = "botPrefix"
                    id = "botPrefix"
                    placeholder = "Prefixo"
                    maxLength = "10"
                    minLength = "1"
                    required = true
                    style = "width: 50%"

                    value = guild.guildSettings.prefix
                }
            }
        }

        div("config-module") {
            label("module-name") { +locale["dashboard.modules.general.autoDeleteMessage.title"] }
            label("switch") {
                input(type = InputType.checkBox) {
                    id = "deleteMessageIfCommandIsExecuted"
                    name = "deleteMessageIfCommandIsExecuted"
                    checked = guild.guildSettings.deleteMessageIfCommandIsExecuted
                }
                span("slider round")
            }
        }

        div("config-module") {
            label("module-name") { +locale["dashboard.modules.general.warnIfCommandIsExecutedInBlockedChannel.title"] }
            label("switch") {
                input(type = InputType.checkBox) {
                    id = "warnIfCommandIsExecutedInBlockedChannel"
                    name = "warnIfCommandIsExecutedInBlockedChannel"
                    checked = guild.guildSettings.sendMessageIfChannelIsBlocked
                }
                span("slider round")
            }
        }

        div("config-module") {
            label("module-name") { +locale["dashboard.modules.general.channelsToBlockCommands.title"] }
            div("channel-selector") {
                style = "display: flex; align-items: center;"
                select {
                    name = "channelsToBlockCommands"
                    id = "channelsToBlockCommands"
                    style = "width: 60%"

                    option {
                        value = ""
                        disabled = true
                        selected = true

                        +locale["dashboard.modules.general.channelsToBlockCommands.selectAChannel"]
                    }
                }
                button {
                    id = "addChannelButton"
                    type = ButtonType.button

                    +locale["dashboard.modules.general.channelsToBlockCommands.addChannelButton"]
                }
            }
            div(classes = "selected-channels") { id = "selectedChannels" }
        }

        getActionWrapper(locale)
    }
}