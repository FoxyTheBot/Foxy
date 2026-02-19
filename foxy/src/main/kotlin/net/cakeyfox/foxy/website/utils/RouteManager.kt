package net.cakeyfox.foxy.website.utils

import io.ktor.server.application.Application
import io.ktor.server.http.content.staticResources
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostAutoRoleSettingsRoute
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostGeneralSettingsRoute
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostSaveYouTubeSettings
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostServerLogsSettingsRoute
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostWelcomerRoute
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostWelcomerTestRoute
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostYouTubeAddChannelRoute
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostYouTubeRemoveChannelRoute
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild.PostYouTubeTestRoute
import net.cakeyfox.foxy.website.routes.api.v1.dashboard.user.PostChangeProfileItemRoute
import net.cakeyfox.foxy.website.routes.dashboard.GetDashboardRoute
import net.cakeyfox.foxy.website.routes.dashboard.GetGenericServerModuleRoute
import net.cakeyfox.foxy.website.routes.dashboard.GetPocketFoxyRoute
import net.cakeyfox.foxy.website.routes.dashboard.GetYouTubeChannelRoute
import net.cakeyfox.foxy.website.routes.dashboard.user.GetUserGenericInventoryRoute
import net.cakeyfox.foxy.website.routes.pages.GetCommandsPage
import net.cakeyfox.foxy.website.routes.pages.GetDailyPage
import net.cakeyfox.foxy.website.routes.pages.GetHomePage
import net.cakeyfox.foxy.website.routes.pages.GetPremiumPage
import net.cakeyfox.foxy.website.routes.pages.GetSupportPage
import net.cakeyfox.foxy.website.routes.pages.GetTermsOfServiceRoute
import net.cakeyfox.foxy.website.routes.partials.GetServerAutoRoleSettingsRoute
import net.cakeyfox.foxy.website.routes.partials.GetYouTubePartial
import net.cakeyfox.foxy.website.routes.partials.dashboard.guild.GetServerGeneralSettingsPartial
import net.cakeyfox.foxy.website.routes.partials.dashboard.guild.GetServerListPartial
import net.cakeyfox.foxy.website.routes.partials.dashboard.guild.GetServerLogsSettingsRoute
import net.cakeyfox.foxy.website.routes.partials.dashboard.guild.GetServerWelcomerSettingsPartial
import net.cakeyfox.foxy.website.routes.partials.dashboard.guild.GetYouTubeChannelPartial
import net.cakeyfox.foxy.website.routes.partials.dashboard.user.GetGenericUserInventoryRoute

fun Application.registerAllRoutes(server: FoxyWebsite) {
    routing {
        get("/") { call.respondRedirect("/br/") }

        // ==[NORMAL PAGES]==
        GetPremiumPage(server).install(this)
        GetCommandsPage(server).install(this)
        GetTermsOfServiceRoute(server).install(this)
        GetSupportPage(server).install(this)
        GetHomePage(server).install(this)
        GetDailyPage(server).install(this)

        // ==[DASHBOARD]==
        GetDashboardRoute(server).install(this)
        GetGenericServerModuleRoute(server).install(this)
        GetPocketFoxyRoute(server).install(this)
        GetYouTubeChannelRoute(server).install(this)
        GetUserGenericInventoryRoute(server).install(this)

        // ==[API]==
        PostServerLogsSettingsRoute(server).install(this)
        PostGeneralSettingsRoute(server).install(this)
        PostWelcomerRoute(server).install(this)
        PostWelcomerTestRoute(server).install(this)
        PostYouTubeTestRoute(server).install(this)
        PostYouTubeRemoveChannelRoute(server).install(this)
        PostYouTubeAddChannelRoute(server).install(this)
        PostSaveYouTubeSettings(server).install(this)
        PostAutoRoleSettingsRoute(server).install(this)
        PostChangeProfileItemRoute(server).install(this)

        // ==[PARTIALS]==
        GetServerListPartial().apply { getServerList(server, server.httpClient) }
        GetServerGeneralSettingsPartial().apply { getServerSettings(server) }
        GetYouTubePartial().apply { getYouTubePartial(server) }
        GetYouTubeChannelPartial().apply { getYouTubeChannel(server) }
        GetServerWelcomerSettingsPartial().apply { getServerSettings(server) }
        GetServerAutoRoleSettingsRoute().apply { getAutoRoleSettings(server) }
        GetServerLogsSettingsRoute().apply { getServerLogsSettingsRoute(server) }
        GetGenericUserInventoryRoute().apply { getUserBackgroundInventory(server) }

        // ==[OAUTH]==
        OAuthManager(server).apply { oauthRoutes() }

        // ==[STATIC CONTENT]==
        staticResources("", "website/")
        staticResources("/v1/assets/css", "static/v1/assets/css")
        staticResources("/dashboard/assets/css", "static/dashboard/assets/css")
        staticResources("/js/", "js/")
        staticResources("/dashboard/js", "dashboard/js")
    }
}