package net.cakeyfox.foxy.website

import com.github.benmanes.caffeine.cache.Caffeine
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respondRedirect
import io.ktor.server.sessions.SameSite
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import io.ktor.server.sessions.sameSite
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.website.utils.DiscordAPIException
import net.cakeyfox.foxy.website.utils.registerAllRoutes
import net.cakeyfox.serializable.data.utils.FoxyConfig
import net.cakeyfox.serializable.data.website.DiscordRole
import net.cakeyfox.serializable.data.website.DiscordServer
import net.cakeyfox.serializable.data.website.UserSession
import java.util.concurrent.TimeUnit

class FoxyWebsite(val foxy: FoxyInstance, val config: FoxyConfig) {
    private val logger = KotlinLogging.logger { }
    val json = Json { ignoreUnknownKeys = true }
    val isProduction = foxy.config.environment == "production"
    val generateHmac = foxy.utils::generateHmac
    val formKeys = Caffeine.newBuilder()
        .expireAfterWrite(1, TimeUnit.MINUTES)
        .maximumSize(100_000)
        .build<String, String>()

    val httpClient = HttpClient(CIO) {
        install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }
    val guildCache = Caffeine.newBuilder()
        .expireAfterWrite(20, TimeUnit.MINUTES)
        .maximumSize(1000)
        .build<String, List<DiscordServer>>()
    val rolesCache = Caffeine.newBuilder()
        .expireAfterWrite(1, TimeUnit.MINUTES)
        .maximumSize(1000)
        .build<String, List<DiscordRole>>()

    private val server = embeddedServer(Netty, config.website.port) {
        install(ContentNegotiation) { json() }
        install(Sessions) {
            cookie<UserSession>("user_session") {
                cookie.path = "/"
                cookie.maxAgeInSeconds = 2592000
                cookie.httpOnly = true
                cookie.sameSite = SameSite.Lax
            }
        }

        registerAllRoutes(this@FoxyWebsite)
    }

    init {
        logger.info { "Running website at port ${config.website.port}" }
        server.start(wait = false)
    }
}