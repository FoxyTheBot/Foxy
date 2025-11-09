package net.cakeyfox.foxy.website.routes.dashboard

import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.common.checkUserPermissions
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.dashboard.frontend.pages.dashboard.getModuleConfig
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.UserSession

class GenericServerConfigRoute {
    fun Routing.getServerConfigPage(server: FoxyWebsite) {
        get("/{lang}/servers/{guildId}/{module}") {
            val isProduction = server.isProduction
            val lang = call.parameters["lang"] ?: "br"
            val locale = FoxyLocale(lang)
            val id = call.parameters["guildId"] ?: return@get
            val module = call.parameters["module"] ?: return@get
            val user = call.sessions.get<UserSession>()
            val guildInfo = server.foxy.database.guild.getGuildOrNull(id)

            if (user == null) return@get call.respondRedirect("/login")
            if (guildInfo == null) return@get call.respondRedirect(Constants.INVITE_LINK)

            val guilds = server.guildCache.getIfPresent(user.userId)
                ?: return@get call.respondRedirect("/${locale.language}/dashboard")
            val guild = guilds.find { it.id == id }
                ?: return@get call.respondRedirect(Constants.INVITE_LINK)

            if (!checkUserPermissions(guild.permissions)) {
                return@get call.respondRedirect("/${locale.language}/dashboard")
            }

            respondWithPage {
                getModuleConfig(
                    call,
                    module,
                    guildInfo,
                    false,
                    locale,
                    isProduction,
                    guilds
                )
            }
        }
    }
}