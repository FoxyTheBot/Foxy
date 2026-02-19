package net.cakeyfox.foxy.website.routes.partials.dashboard.guild

import frontend.htmx.partials.getWelcomerSettings
import io.ktor.server.htmx.hx
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.utils.io.ExperimentalKtorApi
import mu.KotlinLogging
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GetServerWelcomerSettingsPartial {
    @OptIn(ExperimentalKtorApi::class)
    fun Routing.getServerSettings(server: FoxyWebsite) {
        route("/{lang}/partials/{guildId}/welcomer") {
            hx.get {
                val guildId = call.parameters["guildId"] ?: return@get
                val lang = call.parameters["lang"] ?: return@get
                val locale = FoxyLocale(lang)
                checkSession(call, server, call.sessions.get<UserSession>()) ?: return@get
                val idempotencyKey = RouteUtils.generateFormId()

                try {
                    val guild = server.foxy.database.guild.getGuildOrNull(guildId)!!
                    val channels = RouteUtils.getChannelsFromDiscord(server, guildId, call) ?: return@get

                    respondWithPage(call) { getWelcomerSettings(guild, locale, channels, idempotencyKey) }
                } catch(e: Exception) {
                    KotlinLogging.logger {  }.error(e) { }
                }
            }
        }
    }
}