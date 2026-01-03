package frontend.htmx.partials

import frontend.utils.buildModuleForm
import frontend.utils.renderPopUp
import kotlinx.html.ButtonType
import kotlinx.html.FormMethod
import kotlinx.html.InputType
import kotlinx.html.a
import kotlinx.html.button
import kotlinx.html.classes
import kotlinx.html.div
import kotlinx.html.form
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.html.input
import kotlinx.html.label
import kotlinx.html.onClick
import kotlinx.html.p
import kotlinx.html.script
import kotlinx.html.stream.createHTML
import kotlinx.html.unsafe
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.foxy.database.data.guild.YouTubeChannel
import net.cakeyfox.serializable.data.utils.YouTubeQueryBody

fun getYouTubeSettings(
    guild: Guild,
    locale: FoxyLocale,
    savedChannels: List<Pair<YouTubeChannel, YouTubeQueryBody.Item?>>,
    maxChannelsAvailable: Int,
    idempotencyKey: String,
): String {
    return createHTML().div {
        renderPopUp(
            title = "Adicionar Canal",
            description = "Adicione um canal para a Foxy poder enviar notificação no seu servidor!",
            id = "youtubeAddChannelPopUp",
            idempotencyKey = idempotencyKey,
            extraButtonBlock = {
                button(type = ButtonType.button) {
                    this.id = "popUpAddChannelButton"
                    this.attributes["guildId"] = guild._id
                    classes = setOf("popup-button")
                    +"Adicionar"
                }
            }
        ) {
            div("form-group") {
                input(type = InputType.text) {
                    this.name = "channelName"
                    this.placeholder = "https://youtube.com/@FoxyTheBot"
                }
            }
        }

        buildModuleForm(
            "ytForm",
            "/api/v1/servers/${guild._id}/modules/youtube",
            locale,
            idempotencyKey
        ) {
            div {
                div("add-field-button") {
                    button(classes = "add-channel-btn") {
                        this.type = ButtonType.button
                        this.id = "addChannelButton"
                        this.attributes["guildId"] = guild._id
                        this.onClick = "showPopup()"

                        +"Adicionar Canal"
                    }
                }

                savedChannels.forEach { (channel, query) ->
                    div("config-module") {
                        div("channel-info") {
                            img(classes = "config-module-image") { src = query!!.snippet.thumbnails.default.url }
                            label("module-name center") { +query!!.snippet.title }

                            div(classes = "buttons") {
                                a(href = "/${locale.language}/servers/${guild._id}/youtube/${channel.channelId}") {
                                    this.classes = setOf("manage-channel-btn")
                                    button(type = ButtonType.button) { +"Gerenciar" }
                                }

                                a(href = "#") {
                                    this.classes = setOf("manage-channel-btn")
                                    button(type = ButtonType.button) {
                                        this.id = "remove-channel-btn"
                                        attributes["data-remove-youtube"] = ""
                                        attributes["guildId"] = guild._id
                                        attributes["channelId"] = channel.channelId
                                        unsafe {
                                            +"""<svg xmlns="http://www.w3.org/2000/svg"
                                        width="18" height="18" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        viewBox="0 0 24 24">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6l-1 14H6L5 6"/>
                                        <path d="M10 11v6"/>
                                        <path d="M14 11v6"/>
                                        <path d="M9 6V4h6v2"/>
                                        </svg>"""
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}