package net.cakeyfox.foxy.website.routes.dashboard

import frontend.pages.dashboard.getModuleConfig
import io.ktor.server.routing.RoutingContext
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions

class GetGenericServerModuleRoute(val server: FoxyWebsite) : BaseRoute("/servers/{guildId}/{module}") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val isProduction = server.isProduction
        val moduleId = context.call.parameters["module"] ?: return

        val (_, guild, session, guildInfo, availableGuilds) = checkPermissions(server, context, locale, context.call) ?: return
        val isFoxyverseGuild = server.foxy.database.guild.getFoxyverseGuildOrNull(guild.id) != null

        respondWithPage(context.call) {
            getModuleConfig(
                session,
                moduleId,
                guildInfo,
                isFoxyverseGuild,
                locale,
                isProduction,
                availableGuilds
            )
        }
    }
}