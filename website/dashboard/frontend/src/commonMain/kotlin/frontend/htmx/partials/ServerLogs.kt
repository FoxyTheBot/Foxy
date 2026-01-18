package frontend.htmx.partials

import frontend.utils.buildExpandableModuleEntry
import frontend.utils.buildModuleForm
import frontend.utils.buildSimpleChannelSelector
import kotlinx.html.div
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.serializable.data.website.DiscordChannel

fun renderServerLogsPartial(
    guild: Guild,
    locale: FoxyLocale,
    channels: List<DiscordChannel>,
    idempotencyKey: String
): String {
    return createHTML().div {
        buildModuleForm(
            formId = "serverLogsForm",
            formAction = "/api/v1/servers/${guild._id}/modules/serverlogs",
            locale = locale,
            idempotencyKey = idempotencyKey,
        ) {
            buildExpandableModuleEntry(
                entryName = "Notificar quando uma mensagem for atualizada",
                entryId = "notifyWhenMessageUpdate",
                defaultValue = guild.serverLogModule?.sendUpdatedMessagesLogs ?: false,
                optionsId = "notifyWhenMessageUpdateOptions"
            ) {
                buildSimpleChannelSelector(
                    channels,
                    locale,
                    "notifyWhenMessageUpdateLogChannel",
                    guild.serverLogModule?.sendMessageUpdateLogsToChannel
                )
            }

            buildExpandableModuleEntry(
                entryName = "Notificar quando uma mensagem for deletada",
                entryId = "notifyWhenMessageDelete",
                defaultValue = guild.serverLogModule?.sendDeletedMessagesLogs ?: false,
                optionsId = "notifyWhenMessageDeleteOptions"
            ) {
                buildSimpleChannelSelector(
                    channels,
                    locale,
                    "notifyWhenMessageDeleteLogChannel",
                    guild.serverLogModule?.sendMessageDeleteLogsToChannel
                )
            }

            buildExpandableModuleEntry(
                entryName = "Notificar quando alguém entrar ou sair de um canal de voz",
                entryId = "notifyWhenUserJoinsChannel",
                defaultValue = guild.serverLogModule?.sendVoiceChannelLogs ?: false,
                optionsId = "notifyWhenUserJoinsChannelOptions"
            ) {
                buildSimpleChannelSelector(
                    channels,
                    locale,
                    "notifyWhenUserJoinsLogChannel",
                    guild.serverLogModule?.sendVoiceLogsToChannel
                )
            }
        }
    }
}