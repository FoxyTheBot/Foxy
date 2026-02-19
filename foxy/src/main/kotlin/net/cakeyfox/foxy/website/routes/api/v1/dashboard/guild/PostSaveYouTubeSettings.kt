package net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild

import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receiveParameters
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.RoutingContext
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions
import net.cakeyfox.foxy.website.utils.RouteUtils.htmxRedirect
import net.cakeyfox.serializable.data.utils.DiscordMessageBody
import net.cakeyfox.serializable.data.website.MessageSettings
import net.cakeyfox.serializable.data.website.toDiscordEmbedOrNull

class PostSaveYouTubeSettings(val server: FoxyWebsite) : BaseRoute("/api/v1/servers/{guildId}/modules/youtube/{channelId}") {
    private val logger = KotlinLogging.logger { }

    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return
        val channelId = context.call.parameters["channelId"] ?: return

        val guildData = server.foxy.database.guild.getGuildOrNull(guildId)
            ?: return htmxRedirect(context.call, Constants.INVITE_LINK)

        if (guildData.followedYouTubeChannels.find { it.channelId == channelId } == null) {
            return context.call.respond(status = HttpStatusCode.Forbidden, "")
        }

        try {
            checkPermissions(server, context, locale, context.call) ?: return

            val params = context.call.receiveParameters()

            val message = MessageSettings(
                channel = params["channel"],
                content = params["messageContent"],
                embedTitle = params["embedTitle"],
                embedDescription = params["embedDescription"],
                embedThumbnail = params["embedThumbnail"],
                imageLink = params["imageLink"],
                embedFooter = params["embedFooter"]
            )

            val messageAsBody = Json.encodeToString(
                DiscordMessageBody(
                    content = message.content,
                    embeds = listOfNotNull(message.toDiscordEmbedOrNull())
                )
            )

            server.foxy.database.youtube.updateChannelCustomMessage(
                guildId,
                channelId,
                message.channel!!,
                messageAsBody
            )

            context.call.response.headers.append("HX-Refresh", "true")
            context.call.respondText("", ContentType.Text.Html)
        } catch (e: Exception) {
            logger.error(e) { "Error while saving general settings for guild $guildId" }
        }
    }
}