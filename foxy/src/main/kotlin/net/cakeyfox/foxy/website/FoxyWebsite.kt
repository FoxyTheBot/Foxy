package net.cakeyfox.foxy.website

import com.github.benmanes.caffeine.cache.Caffeine
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.http.content.resources
import io.ktor.server.http.content.static
import io.ktor.server.http.content.staticResources
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.routing.routing
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.website.routes.RouteManager
import net.cakeyfox.foxy.website.utils.OAuthManager
import net.cakeyfox.serializable.data.utils.FoxyConfig
import net.cakeyfox.serializable.data.website.DiscordServer
import net.cakeyfox.serializable.data.website.UserSession
import java.util.concurrent.TimeUnit

class FoxyWebsite(val foxy: FoxyInstance, val config: FoxyConfig) {
    private val logger = KotlinLogging.logger {  }
    private val json = Json { ignoreUnknownKeys = true }
    lateinit var locale: FoxyLocale
    val guildCache = Caffeine.newBuilder()
        .expireAfterWrite(20, TimeUnit.MINUTES)
        .maximumSize(1000)
        .build<String, List<DiscordServer>>()

    val isProduction = foxy.config.environment == "production"

    private val server = embeddedServer(Netty, config.website.port) {
        install(ContentNegotiation) { json() }
        install(Sessions) {
            cookie<UserSession>("user_session") {
                cookie.path = "/"
                cookie.httpOnly = true
            }
        }

        routing {
            RouteManager(this@FoxyWebsite).apply { registerRoutes() }
            OAuthManager(this@FoxyWebsite).apply {
                oauthRoutes(config.discord.applicationId.toString(), config.discord.clientSecret, json)
            }
            staticResources("", "website/")
            staticResources("/v1/assets/css", "static/v1/assets/css")
            staticResources("/dashboard/assets/css", "static/dashboard/assets/css")
            staticResources("/js/", "js/")
            staticResources("/dashboard/js", "dashboard/js")
        }
    }

    init {
        logger.info { "Running website at port ${config.website.port}" }
        server.start(wait = false)
    }

    fun stop() {
        server.stop(10, 10, TimeUnit.SECONDS)
        logger.info { "Stopping website webserver... "}
    }
}