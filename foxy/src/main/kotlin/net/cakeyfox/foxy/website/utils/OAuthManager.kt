package net.cakeyfox.foxy.website.utils

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.forms.submitForm
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import io.ktor.http.Parameters
import io.ktor.http.URLBuilder
import io.ktor.server.response.respondRedirect
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.header
import io.ktor.server.sessions.clear
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.server.sessions.set
import kotlinx.coroutines.delay
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.serializable.data.website.DiscordUser
import net.cakeyfox.serializable.data.website.TokenResponse
import net.cakeyfox.serializable.data.website.UserSession
import kotlin.time.Duration.Companion.seconds

class OAuthManager(val server: FoxyWebsite) {
    val redirectUri = "${server.config.website.url.removeSuffix("/")}/login/callback"
    val clientId = server.config.discord.applicationId.toString()
    val clientSecret = server.config.discord.clientSecret
    private val logger = KotlinLogging.logger {}

    fun Route.oauthRoutes() {
        get("/login") {
            call.sessions.clear<UserSession>()
            val scope = listOf("identify", "email", "guilds").joinToString(" ")
            val url = URLBuilder(Constants.AUTHORIZATION_ENDPOINT).apply {
                parameters.append("client_id", clientId)
                parameters.append("redirect_uri", redirectUri)
                parameters.append("response_type", "code")
                parameters.append("scope", scope)
            }.buildString()

            call.respondRedirect(url)
        }

        get("/login/callback") {
            val code = call.request.queryParameters["code"]
            if (code.isNullOrEmpty()) {
                call.respondText("Missing authorization code", status = HttpStatusCode.BadRequest)
                return@get
            }

            val tokenResponse: HttpResponse = server.httpClient.submitForm(
                url = Constants.TOKEN_ENDPOINT,
                formParameters = Parameters.build {
                    append("client_id", clientId)
                    append("client_secret", clientSecret)
                    append("grant_type", "authorization_code")
                    append("code", code)
                    append("redirect_uri", redirectUri)
                    append("scope", "identify email")
                }
            )

            if (tokenResponse.status != HttpStatusCode.OK) {
                val text = tokenResponse.bodyAsText()
                call.respondText("Error while getting Discord Authorization Token: $text", status = tokenResponse.status)
                return@get
            }

            val tokenJson = tokenResponse.bodyAsText()
            val tokenData = server.json.decodeFromString<TokenResponse>(tokenJson)

            val userResponse: HttpResponse = server.httpClient.get(Constants.DEFAULT_ENDPOINT) {
                header("Authorization", "${tokenData.token_type} ${tokenData.access_token}")
            }

            if (userResponse.status != HttpStatusCode.OK) {
                val text = userResponse.bodyAsText()
                call.respondText("Error while getting user information: $text", status = userResponse.status)
                return@get
            }

            val userJson = userResponse.bodyAsText()
            val discordUser = server.json.decodeFromString<DiscordUser>(userJson)
            val hmacSignature = server.foxy.utils.generateHmac("${discordUser.id}:${tokenData.access_token}")

            val currentSession = call.sessions.get<UserSession>()

            if (currentSession != null) call.sessions.clear<UserSession>()

            call.sessions.set(
                UserSession(
                    userId = discordUser.id,
                    username = discordUser.username,
                    globalName = discordUser.global_name,
                    avatar = discordUser.avatar ?: Constants.DISCORD_DEFAULT_AVATAR,
                    accessToken = tokenData.access_token,
                    tokenType = tokenData.token_type,
                    hmac = hmacSignature,
                )
            )

            logger.info { "${discordUser.username} (${discordUser.id}) is logged" }
            delay(1.seconds)
            call.respondRedirect("/br/dashboard")
        }

        get("/logout") {
            call.sessions.clear<UserSession>()
            call.respondRedirect("/")
        }
    }
}