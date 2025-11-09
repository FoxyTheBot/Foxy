package net.cakeyfox.foxy.dashboard.frontend.pages.dashboard

import io.ktor.server.routing.RoutingCall
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.html.body
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.dashboard.frontend.utils.buildDashboardModule
import net.cakeyfox.foxy.dashboard.frontend.utils.renderGuildSidebar
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.DiscordServer

@OptIn(ExperimentalKtorApi::class)
fun getModuleConfig(
    call: RoutingCall,
    moduleId: String,
    guild: Guild,
    isFoxyverseGuild: Boolean,
    locale: FoxyLocale,
    isProduction: Boolean,
    availableGuilds: List<DiscordServer>
): String {
    return buildDashboardModule(
        call,
        titleText = locale["dashboard.modules.manage", locale["dashboard.modules.$moduleId.title"]],
        moduleTitle = locale["dashboard.modules.$moduleId.title"],
        moduleDescription = locale["dashboard.modules.$moduleId.description"],
        guild = guild,
        locale = locale,
        isProduction = isProduction,
        isFoxyverseGuild = isFoxyverseGuild,
        partialUrl = "/${locale.language}/partials/${guild._id}/$moduleId",
        availableGuilds
    )
}