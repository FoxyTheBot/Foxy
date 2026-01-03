package net.cakeyfox.foxy.website.routes.api.v1

import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.header
import io.ktor.server.request.receiveParameters
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.server.routing.RoutingContext
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.common.checkUserPermissions
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.htmxRedirect
import net.cakeyfox.serializable.data.website.UserSession

class PostGeneralSettingsRoute(val server: FoxyWebsite) :
    BaseRoute("/api/v1/servers/{guildId}/modules/general") {

    private val logger = KotlinLogging.logger { }

    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return

        val guildData = server.foxy.database.guild.getGuildOrNull(guildId)
            ?: return htmxRedirect(context.call, Constants.INVITE_LINK)

        try {
            checkPermissions(server, context, locale) ?: return

            val params = context.call.receiveParameters()
            fun io.ktor.http.Parameters.getBoolean(name: String) = this[name] == "on"

            val cleanedBlocked = Json.decodeFromString<List<String>>(params["blockedChannels"] ?: "[]")
            val channelsToRemove = Json.decodeFromString<List<String>>(params["removedChannels"] ?: "[]")

            val currentBlocked = guildData.guildSettings.blockedChannels
            val afterAdd = (currentBlocked + cleanedBlocked).distinct()
            val finalBlocked = afterAdd.filterNot { it in channelsToRemove }

            server.foxy.database.guild.updateGuild(guildId) {
                guildSettings.apply {
                    prefix = params["botPrefix"]
                    deleteMessageIfCommandIsExecuted = params.getBoolean("deleteMessageIfCommandIsExecuted")
                    sendMessageIfChannelIsBlocked = params.getBoolean("warnIfCommandIsExecutedInBlockedChannel")

                    blockedChannels.addAll(finalBlocked)
                }
            }

            context.call.response.headers.append("HX-Refresh", "true")
            context.call.respondText("", ContentType.Text.Html)
        } catch (e: Exception) {
            logger.error(e) { "Error while saving general settings for guild $guildId" }
        }
    }
}
