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
import io.ktor.server.sessions.clear
import io.ktor.server.sessions.sessions
import io.ktor.server.sessions.set
import kotlinx.serialization.json.Json
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.serializable.data.website.DiscordUser
import net.cakeyfox.serializable.data.website.TokenResponse
import net.cakeyfox.serializable.data.website.UserSession

class OAuthManager(val server: FoxyWebsite) {
    fun Route.oauthRoutes(clientId: String, clientSecret: String, json: Json) {
        val httpClient = HttpClient(CIO)
        val redirectUri = "${server.config.website.url.removeSuffix("/")}/login/callback"

        get("/login") {
            val scope = listOf("identify", "email").joinToString(" ")
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
                call.respondText("Código de autorização ausente", status = HttpStatusCode.Companion.BadRequest)
                return@get
            }

            val tokenResponse: HttpResponse = httpClient.submitForm(
                url = Constants.TOKEN_ENDPOINT,
                formParameters = Parameters.Companion.build {
                    append("client_id", clientId)
                    append("client_secret", clientSecret)
                    append("grant_type", "authorization_code")
                    append("code", code)
                    append("redirect_uri", redirectUri)
                    append("scope", "identify email")
                }
            )

            if (tokenResponse.status != HttpStatusCode.Companion.OK) {
                val text = tokenResponse.bodyAsText()
                call.respondText("Erro ao obter token do Discord: $text", status = tokenResponse.status)
                return@get
            }

            val tokenJson = tokenResponse.bodyAsText()
            val tokenData = json.decodeFromString<TokenResponse>(tokenJson)

            val userResponse: HttpResponse = httpClient.get(Constants.DEFAULT_ENDPOINT) {
                header("Authorization", "${tokenData.token_type} ${tokenData.access_token}")
            }

            if (userResponse.status != HttpStatusCode.Companion.OK) {
                val text = userResponse.bodyAsText()
                call.respondText("Erro ao obter dados do usuário: $text", status = userResponse.status)
                return@get
            }

            val userJson = userResponse.bodyAsText()
            val discordUser = json.decodeFromString<DiscordUser>(userJson)
            call.sessions.set(
                UserSession(
                    userId = discordUser.id,
                    username = discordUser.username,
                    globalName = discordUser.global_name,
                    avatar = discordUser.avatar,
                    accessToken = tokenData.access_token,
                    tokenType = tokenData.token_type
                )
            )

            call.respondRedirect("/br/dashboard")
        }

        get("/logout") {
            call.sessions.clear<UserSession>()
            call.respondRedirect("/")
        }
    }
}