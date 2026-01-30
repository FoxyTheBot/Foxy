package net.cakeyfox.foxy.website.routes.partials.dashboard.guild

import frontend.htmx.partials.getYouTubeChannelPage
import io.ktor.server.htmx.hx
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.utils.io.ExperimentalKtorApi
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage

class GetYouTubeChannelPartial {
    @OptIn(ExperimentalKtorApi::class)
    fun Routing.getYouTubeChannel(server: FoxyWebsite) {
        route("/{lang}/partials/{guildId}/youtube/{channelId}") {
            hx.get {
                val channelId = call.parameters["channelId"] ?: return@get
                val guildId = call.parameters["guildId"] ?: return@get
                val lang = call.parameters["lang"] ?: return@get
                val locale = FoxyLocale(lang)
                val guild = server.foxy.database.guild.getGuildOrNull(guildId)!!
                val channelInfo = server.foxy.youtubeManager.getChannelInfo(channelId)?.items?.get(0)
                val channels = RouteUtils.getChannelsFromDiscord(server, guildId)
                val idempotencyKey = RouteUtils.generateFormId()

                respondWithPage(call) { getYouTubeChannelPage(guild, locale, channelInfo, channels, idempotencyKey) }
            }
        }
    }
}