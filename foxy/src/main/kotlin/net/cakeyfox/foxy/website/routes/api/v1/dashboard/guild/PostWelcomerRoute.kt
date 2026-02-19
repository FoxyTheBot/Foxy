package net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild

import io.ktor.http.ContentType
import io.ktor.http.Parameters
import io.ktor.server.request.receiveParameters
import io.ktor.server.response.respondText
import io.ktor.server.routing.RoutingContext
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions
import net.cakeyfox.serializable.data.utils.DiscordMessageBody
import net.cakeyfox.serializable.data.website.EventType
import net.cakeyfox.serializable.data.website.MessageSettings
import net.cakeyfox.serializable.data.website.toDiscordEmbedOrNull

class PostWelcomerRoute(val server: FoxyWebsite) :
    BaseRoute("/api/v1/servers/{guildId}/modules/welcomer") {

    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return

        try {
            checkPermissions(server, context, locale, context.call) ?: return

            val params = context.call.receiveParameters()
            fun Parameters.getBoolean(name: String) = this[name] == "on"

            val messages = mapOf(
                EventType.JOIN to MessageSettings(
                    channel = params["welcomeChannel"],
                    content = params["messageContent"],
                    embedTitle = params["welcomeEmbedTitle"],
                    embedDescription = params["welcomeEmbedDescription"],
                    embedThumbnail = params["welcomeEmbedThumbnail"],
                    imageLink = params["welcomeImageLink"],
                    embedFooter = params["welcomeEmbedFooter"]
                ),
                EventType.LEAVE to MessageSettings(
                    channel = params["leaveChannel"],
                    content = params["leaveMessageContent"],
                    embedTitle = params["leaveEmbedTitle"],
                    embedDescription = params["leaveEmbedDescription"],
                    embedThumbnail = params["leaveEmbedThumbnail"],
                    imageLink = params["leaveImageLink"],
                    embedFooter = params["leaveEmbedFooter"]
                ),
                EventType.DM to MessageSettings(
                    content = params["dmMessageContent"],
                    embedTitle = params["dmEmbedTitle"],
                    embedDescription = params["dmEmbedDescription"],
                    embedThumbnail = params["dmEmbedThumbnail"],
                    imageLink = params["dmImageLink"],
                    embedFooter = params["dmEmbedFooter"]
                )
            )

            val body = mapOf(
                "whenUserJoinsSettings" to Json.encodeToString(
                    DiscordMessageBody(
                        content = messages[EventType.JOIN]?.content,
                        embeds = listOfNotNull(messages[EventType.JOIN]?.toDiscordEmbedOrNull())
                    )
                ),
                "whenUserLeavesSettings" to Json.encodeToString(
                    DiscordMessageBody(
                        content = messages[EventType.LEAVE]?.content,
                        embeds = listOfNotNull(messages[EventType.LEAVE]?.toDiscordEmbedOrNull())
                    )
                ),
                "dmSettings" to Json.encodeToString(
                    DiscordMessageBody(
                        content = messages[EventType.DM]?.content,
                        embeds = listOfNotNull(messages[EventType.DM]?.toDiscordEmbedOrNull())
                    )
                )
            )

            server.foxy.database.guild.updateGuild(guildId) {
                guildJoinLeaveModule.isEnabled = params.getBoolean("toggleWelcomeModule")
                guildJoinLeaveModule.sendDmWelcomeMessage = params.getBoolean("toggleDMWelcomeModule")
                guildJoinLeaveModule.alertWhenUserLeaves = params.getBoolean("toggleLeaveModule")

                guildJoinLeaveModule.joinChannel = messages[EventType.JOIN]?.channel
                guildJoinLeaveModule.leaveChannel = messages[EventType.LEAVE]?.channel
                guildJoinLeaveModule.joinMessage = body["whenUserJoinsSettings"]
                guildJoinLeaveModule.leaveMessage = body["whenUserLeavesSettings"]
                guildJoinLeaveModule.dmWelcomeMessage = body["dmSettings"]
            }

            context.call.response.headers.append("HX-Refresh", "true")
            context.call.respondText("", ContentType.Text.Html)
        } catch (e: Exception) {
            KotlinLogging.logger {}.error(e) {
                "Error while saving welcomer settings"
            }
        }
    }
}
