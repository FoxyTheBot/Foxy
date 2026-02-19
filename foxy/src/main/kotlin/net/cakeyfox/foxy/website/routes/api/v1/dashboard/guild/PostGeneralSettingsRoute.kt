package net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild

import io.ktor.http.ContentType
import io.ktor.http.Parameters
import io.ktor.server.request.receiveParameters
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

class PostGeneralSettingsRoute(val server: FoxyWebsite) :
    BaseRoute("/api/v1/servers/{guildId}/modules/general") {

    private val logger = KotlinLogging.logger { }

    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return

        val guildData = server.foxy.database.guild.getGuildOrNull(guildId)
            ?: return htmxRedirect(context.call, Constants.INVITE_LINK)

        try {
            checkPermissions(server, context, locale, context.call) ?: return

            val params = context.call.receiveParameters()
            fun Parameters.getBoolean(name: String) = this[name] == "on"

            val cleanedBlocked = Json.decodeFromString<List<String>>(params["blockedChannels"] ?: "[]")
            val channelsToRemove = Json.decodeFromString<List<String>>(params["removedChannels"] ?: "[]")

            val currentBlocked = guildData.guildSettings.blockedChannels
            val afterAdd = (currentBlocked + cleanedBlocked).distinct()
            val finalBlocked = afterAdd.filterNot { it in channelsToRemove }
            val supportedLanguages = listOf("pt-BR", "en-US")

            val selectedLang = params["languageSelector"]

            server.foxy.database.guild.updateGuild(guildId) {
                guildSettings.apply {
                    prefix = params["botPrefix"]
                    if (selectedLang in supportedLanguages) {
                        language = selectedLang
                    }
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
