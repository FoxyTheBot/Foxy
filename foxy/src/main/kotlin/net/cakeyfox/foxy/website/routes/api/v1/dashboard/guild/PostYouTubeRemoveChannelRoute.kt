package net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.RoutingContext
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.common.LogType
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions

class PostYouTubeRemoveChannelRoute(val server: FoxyWebsite) :
    BaseRoute("/api/v1/servers/{guildId}/modules/youtube/{channelId}/remove") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return
        val guildData = server.foxy.database.guild.getGuildOrNull(guildId)
        val channelId = context.call.parameters["channelId"] ?: return

        if (guildData == null) return

       val result = checkPermissions(server, context, locale, context.call) ?: return

        val followedChannel = guildData.followedYouTubeChannels.find { it.channelId == channelId }

        if (followedChannel != null) {
            server.foxy.database.youtube.removeChannelFromGuild(guildId, channelId)
            server.foxy.database.guild.addLogToGuild(
                guildId,
                result.user.id,
                LogType.UPDATE_YOUTUBE_SETTINGS.value
            )
        }

        context.call.respond(HttpStatusCode.OK)
    }
}