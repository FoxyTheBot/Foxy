package net.cakeyfox.foxy.website.routes.partials

import com.github.benmanes.caffeine.cache.Caffeine
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.url
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.server.htmx.hx
import io.ktor.server.response.respondRedirect
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.sessions.get
import io.ktor.server.sessions.get as getSession
import io.ktor.server.sessions.sessions
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.serialization.json.Json
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.common.checkUserPermissions
import net.cakeyfox.foxy.dashboard.frontend.htmx.partials.renderServerList
import net.cakeyfox.foxy.dashboard.frontend.htmx.partials.renderServerListPage
import net.cakeyfox.foxy.dashboard.frontend.pages.dashboard.getModuleConfig
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.DiscordServer
import net.cakeyfox.serializable.data.website.UserSession
import java.util.concurrent.TimeUnit

class ServerListRoute {
    private val json = Json { ignoreUnknownKeys = true }
    @OptIn(ExperimentalKtorApi::class)
    fun Route.getServerList(server: FoxyWebsite, httpClient: HttpClient) {
        route("/{lang}/partials/servers") {
            hx.get {
                val session = call.sessions.getSession<UserSession>() ?: return@get call.respondRedirect("/login")
                val lang = call.parameters["lang"] ?: return@get
                val locale = FoxyLocale(lang)
                var guilds = server.guildCache.getIfPresent(session.userId)

                try {
                    if (guilds == null) {
                        guilds = getUserGuilds(session, httpClient)
                        server.guildCache.put(session.userId, guilds)
                    }

                    val authorizedGuilds = guilds.filter { guild ->
                        checkUserPermissions(guild.permissions)
                    }

                    respondWithPage {
                        renderServerListPage(authorizedGuilds, locale)
                    }
                } catch (e: Exception) {
                    println(e.message)
                }
            }
        }
    }

    suspend fun getUserGuilds(session: UserSession, client: HttpClient): List<DiscordServer> {
        val response = client.get {
            url(Constants.DISCORD_GUILD_LIST)
            header("Authorization", "${session.tokenType} ${session.accessToken}")
        }
        return json.decodeFromString(response.bodyAsText())
    }
}