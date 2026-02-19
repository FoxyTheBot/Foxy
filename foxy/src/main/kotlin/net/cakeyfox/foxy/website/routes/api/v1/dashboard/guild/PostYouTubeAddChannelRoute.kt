package net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild

import io.ktor.server.request.header
import io.ktor.server.request.receive
import io.ktor.server.response.respondText
import io.ktor.server.routing.RoutingContext
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions

class PostYouTubeAddChannelRoute(val server: FoxyWebsite) :
    BaseRoute("/api/v1/servers/{guildId}/modules/youtube/channel/add") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return
        val guildData = server.foxy.database.guild.getGuildOrNull(guildId)
        val idempotencyKey = context.call.request.header("Foxy-Idempotency-Key") ?: return println("Missing key")
        val locked = RouteUtils.tryLockForm(server, guildId, idempotencyKey)

        if (!locked) return

        val channelQuery = context.call.receive<String>()
        if (guildData == null) return

        checkPermissions(server, context, locale, context.call) ?: return
        val channelInfo = server.foxy.youtubeManager.getChannelInfo(channelQuery)
            ?.items?.get(0) ?: return

        val followedChannel = guildData.followedYouTubeChannels.find { it.channelId == channelInfo.id }

        if (followedChannel == null) {
            server.foxy.youtubeManager.createWebhook(channelInfo.id)
            server.foxy.database.youtube.addChannelToAGuild(
                guildId,
                channelInfo.id,
                "",
                ""
            )
        }

        RouteUtils.removeFormLock(server, guildId)
        context.call.respondText("/${locale.language}/servers/$guildId/youtube/${channelInfo.id}")
    }
}