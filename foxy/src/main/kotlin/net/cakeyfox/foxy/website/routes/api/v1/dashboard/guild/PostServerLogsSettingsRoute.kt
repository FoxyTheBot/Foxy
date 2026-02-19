package net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild

import io.ktor.http.ContentType
import io.ktor.http.Parameters
import io.ktor.server.request.receiveParameters
import io.ktor.server.response.respondText
import io.ktor.server.routing.RoutingContext
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions
import net.cakeyfox.foxy.website.utils.RouteUtils.htmxRedirect

class PostServerLogsSettingsRoute(val server: FoxyWebsite) : BaseRoute("/api/v1/servers/{guildId}/modules/serverlogs") {
    private val logger = KotlinLogging.logger { }

    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return

        val guildData = server.foxy.database.guild.getGuildOrNull(guildId)
            ?: return htmxRedirect(context.call, Constants.INVITE_LINK)

        try {
            checkPermissions(server, context, locale, context.call) ?: return

            val params = context.call.receiveParameters()
            fun Parameters.getBoolean(name: String) = this[name] == "on"

            server.foxy.database.guild.updateGuild(guildId) {
                serverLogModule.apply {
                    setupLog(
                        params.getBoolean("notifyWhenUserJoinsChannel"),
                        params["notifyWhenUserJoinsLogChannel"]
                    ) { enabled, id ->
                        sendVoiceChannelLogs = enabled
                        sendVoiceLogsToChannel = id
                    }

                    setupLog(
                        params.getBoolean("notifyWhenMessageDelete"),
                        params["notifyWhenMessageDeleteLogChannel"]
                    ) { enabled, id ->
                        sendDeletedMessagesLogs = enabled
                        sendMessageDeleteLogsToChannel = id
                    }

                    setupLog(
                        params.getBoolean("notifyWhenMessageUpdate"),
                        params["notifyWhenMessageUpdateLogChannel"]
                    ) { enabled, id ->
                        sendUpdatedMessagesLogs = enabled
                        sendMessageUpdateLogsToChannel = id
                    }
                }
            }

            context.call.response.headers.append("HX-Refresh", "true")
            context.call.respondText("", ContentType.Text.Html)
        } catch (e: Exception) {
            logger.error(e) { "Error while saving general settings for guild $guildId" }
        }
    }

    private fun setupLog(enabled: Boolean, channelId: String?, action: (Boolean, String?) -> Unit) {
        if (enabled && channelId != null) {
            action(true, channelId)
        } else {
            action(false, null)
        }
    }
}