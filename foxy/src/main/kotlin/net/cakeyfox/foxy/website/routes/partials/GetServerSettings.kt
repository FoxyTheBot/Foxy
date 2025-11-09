package net.cakeyfox.foxy.website.routes.partials

import io.ktor.http.ContentType
import io.ktor.server.htmx.hx
import io.ktor.server.response.respondRedirect
import io.ktor.server.response.respondText
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.utils.io.ExperimentalKtorApi
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.dashboard.frontend.htmx.partials.getGeneralSettings
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GetServerSettings {
    @OptIn(ExperimentalKtorApi::class)
    fun Routing.getServerSettings(server: FoxyWebsite) {
        route("/{lang}/partials/{guildId}/general") {
            hx.get {
                val guildId = call.parameters["guildId"] ?: return@get
                val lang = call.parameters["lang"] ?: return@get
                val locale = FoxyLocale(lang)
                call.sessions.get<UserSession>() ?: return@get call.respondRedirect("/login")

                try {
                    val guild = server.foxy.database.guild.getGuildOrNull(guildId)!!

                    respondWithPage { getGeneralSettings(guild, locale) }
                } catch(e: Exception) {
                    call.respondRedirect("/login")
                }
            }
        }
    }
}