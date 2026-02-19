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

class PostAutoRoleSettingsRoute(val server: FoxyWebsite) : BaseRoute("/api/v1/servers/{guildId}/modules/autorole") {
    private val logger = KotlinLogging.logger { }

    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return

        val guildData = server.foxy.database.guild.getGuildOrNull(guildId)
            ?: return htmxRedirect(context.call, Constants.INVITE_LINK)

        try {
            checkPermissions(server, context, locale, context.call) ?: return
            fun Parameters.getBoolean(name: String) = this[name] == "on"

            val params = context.call.receiveParameters()

            val addedRoles = Json.decodeFromString<List<String>>(params["addedRoles"] ?: "[]")
            val removedRoles = Json.decodeFromString<List<String>>(params["removedRoles"] ?: "[]")

            val currentRoles = guildData.AutoRoleModule?.roles ?: emptyList()
            val afterAdd = (currentRoles + addedRoles).distinct()
            val allRoles = afterAdd.filterNot { it in removedRoles }

            server.foxy.database.guild.updateGuild(guildId) {
                autoRoleModule.isEnabled = params.getBoolean("enableAutoRole")
                autoRoleModule.roles.addAll(allRoles)
            }

            context.call.response.headers.append("HX-Refresh", "true")
            context.call.respondText("", ContentType.Text.Html)
        } catch (e: Exception) {
            logger.error(e) { "Error while saving general settings for guild $guildId" }
        }
    }
}