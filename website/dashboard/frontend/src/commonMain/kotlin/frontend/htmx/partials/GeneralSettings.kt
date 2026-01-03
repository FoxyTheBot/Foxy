package frontend.htmx.partials

import frontend.utils.buildGenericModuleEntry
import net.cakeyfox.common.FoxyLocale
import frontend.utils.buildModuleForm
import frontend.utils.buildSliderModuleEntry
import frontend.utils.buildTextModuleEntry
import kotlinx.html.ButtonType
import kotlinx.html.button
import kotlinx.html.classes
import kotlinx.html.div
import kotlinx.html.id
import kotlinx.html.option
import kotlinx.html.select
import kotlinx.html.span
import kotlinx.html.stream.createHTML
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.serializable.data.website.DiscordChannel

fun getGeneralSettings(
    guild: Guild,
    locale: FoxyLocale,
    channels: List<DiscordChannel>,
    blockedChannels: List<String>,
    idempotencyKey: String
): String {
    return createHTML().div {
        buildModuleForm(
            formId = "postGeneralSettings",
            formAction = "/api/v1/servers/${guild._id}/modules/general",
            locale = locale,
            idempotencyKey = idempotencyKey
        ) {
            buildTextModuleEntry(
                entryName = locale["dashboard.modules.general.changePrefix.title"],
                entryId = "botPrefix",
                entryPlaceholder = ".",
                defaultValue = guild.guildSettings.prefix,
                isRequired = true
            )

            buildSliderModuleEntry(
                entryName = locale["dashboard.modules.general.autoDeleteMessage.title"],
                entryId = "deleteMessageIfCommandIsExecuted",
                defaultValue = guild.guildSettings.deleteMessageIfCommandIsExecuted
            )

            buildSliderModuleEntry(
                entryName = locale["dashboard.modules.general.warnIfCommandIsExecutedInBlockedChannel.title"],
                entryId = "warnIfCommandIsExecutedInBlockedChannel",
                defaultValue = guild.guildSettings.sendMessageIfChannelIsBlocked
            )

            buildGenericModuleEntry(locale["dashboard.modules.general.channelsToBlockCommands.title"]) {
                div("channel-selector") {
                    select {
                        name = "channelsToBlockCommands"
                        id = "channelsToBlockCommands"

                        channels.forEach { channel ->
                            option {
                                this.value = channel.id
                                +channel.name
                            }
                        }
                    }
                    button {
                        id = "addChannelButton"
                        type = ButtonType.button
                        +locale["dashboard.modules.general.channelsToBlockCommands.addChannelButton"]
                    }
                }

                div(classes = "selected-channels") {
                    id = "selectedChannels"

                    blockedChannels.forEach { channelId ->
                        span {
                            this.id = "channel-$channelId"
                            this.classes = setOf("channel-mention")

                            val channelName = channels.find { it.id == channelId }!!.name
                            +"#$channelName"

                            button {
                                this.id = "removeChannel-$channelId"
                                this.classes = setOf("remove-channel")
                                this.type = ButtonType.button

                                +"Remover"
                            }
                        }
                    }
                }
            }
        }
    }
}