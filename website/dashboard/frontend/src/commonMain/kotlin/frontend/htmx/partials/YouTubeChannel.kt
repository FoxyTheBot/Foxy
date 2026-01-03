package frontend.htmx.partials

import frontend.utils.buildGenericEmbed
import frontend.utils.buildModuleForm
import frontend.utils.buildToggleableEntry
import frontend.utils.buildToggleableTextField
import frontend.utils.getChannelList
import kotlinx.html.ButtonType
import kotlinx.html.br
import kotlinx.html.button
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.html.label
import kotlinx.html.select
import kotlinx.html.stream.createHTML
import kotlinx.html.style
import kotlinx.serialization.json.Json
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.serializable.data.utils.DiscordMessageBody
import net.cakeyfox.serializable.data.utils.YouTubeQueryBody
import net.cakeyfox.serializable.data.website.DiscordChannel

fun getYouTubeChannelPage(
    guild: Guild,
    locale: FoxyLocale,
    currentChannel: YouTubeQueryBody.Item?,
    channels: List<DiscordChannel>,
    idempotencyKey: String
): String {
    val raw = guild.followedYouTubeChannels
        .find { it.channelId == currentChannel?.id }
        ?.notificationMessage
        ?: """{ "content": "oi!" }"""

    val youtubeMessage = try {
        Json.decodeFromString<DiscordMessageBody>(raw)
    } catch (e: Exception) {
        DiscordMessageBody(content = raw)
    }

    return createHTML().div {
        buildModuleForm(
            formId = "ytSettings",
            formAction = "/api/v1/servers/${guild._id}/modules/youtube/${currentChannel!!.id}",
            locale = locale,
            idempotencyKey = idempotencyKey
        ) {
            div(classes = "channel-info-module") {
                img(src = currentChannel.snippet.thumbnails.default.url, classes = "icon-md")
                h1(classes = "channel-name") { +currentChannel.snippet.title }
            }

            div("config-module") {
                label("module-name") { +"Canal de texto onde enviarei as notificações" }
                div("channel-selector") {
                    style = "display: flex; align-items: center;"
                    select {
                        name = "channel"
                        id = "channel"

                        getChannelList(
                            channels,
                            guild.followedYouTubeChannels.find { it.channelId == currentChannel.id }
                                ?.channelToSend
                        )
                    }
                }
            }

            div("config-module") {

                buildToggleableEntry("Mensagem que será enviada no canal de texto") {
                    br()
                    div("button-wrapper") {
                        button {
                            this.id = "ytTestButton"
                            type = ButtonType.button
                            attributes["guildId"] = guild._id
                            attributes["channelId"] = currentChannel.id
                            +"Testar Mensagem"
                        }
                    }

                    br { }

                    buildToggleableTextField(
                        entryName = "Conteúdo da Mensagem",
                        entryId = "messageContent",
                        entryPlaceholder = "Conteúdo da Mensagem",
                        defaultValue = youtubeMessage.content
                    )

                    buildGenericEmbed(youtubeMessage)
                }
            }
        }
    }
}