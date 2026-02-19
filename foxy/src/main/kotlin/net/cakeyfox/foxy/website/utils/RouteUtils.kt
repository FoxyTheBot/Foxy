package net.cakeyfox.foxy.website.utils

import dev.minn.jda.ktx.coroutines.await
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.url
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.isSuccess
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import io.ktor.server.response.respondRedirect
import io.ktor.server.response.respondText
import io.ktor.server.routing.RoutingCall
import io.ktor.server.routing.RoutingContext
import io.ktor.server.sessions.clear
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import kotlinx.serialization.builtins.ListSerializer
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.common.checkUserPermissions
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.serializable.data.website.DiscordAPIError
import net.cakeyfox.serializable.data.website.DiscordChannel
import net.cakeyfox.serializable.data.website.DiscordRole
import net.cakeyfox.serializable.data.website.DiscordServer
import net.cakeyfox.serializable.data.website.UserSession
import net.dv8tion.jda.api.entities.User
import java.util.UUID

object RouteUtils {
    data class PermissionResult(
        val user: User,
        val guild: DiscordServer,
        val session: UserSession?,
        val guildInfo: net.cakeyfox.foxy.database.data.guild.Guild,
        val authorizedGuilds: List<DiscordServer>
    )

    suspend fun respondWithPage(call: RoutingCall, statusCode: HttpStatusCode? = null, provider: suspend () -> String) {
        call.respondText(ContentType.Text.Html, statusCode ?: HttpStatusCode.OK, provider)
    }

    fun removeFormLock(server: FoxyWebsite, guildId: String) = server.formKeys.invalidate(guildId)

    fun tryLockForm(server: FoxyWebsite, guildId: String, formId: String): Boolean {
        return server.formKeys.asMap()
            .putIfAbsent(guildId, formId) == null
    }

    fun generateFormId(): String = UUID.randomUUID().toString()

    suspend fun getRolesFromAGuild(server: FoxyWebsite, guildId: String, client: HttpClient): List<DiscordRole> {
        val cachedRoles = server.rolesCache.getIfPresent(guildId)
        if (cachedRoles != null) return cachedRoles

        val response = client.get {
            url("https://discord.com/api/guilds/$guildId/roles")
            header("Authorization", "Bot ${server.config.discord.token}")
        }

        val roles = server.json.decodeFromString<List<DiscordRole>>(response.bodyAsText())
            .filterNot { (id, name, position, managed) ->
                managed || name.startsWith("@everyone")
            }

        server.rolesCache.put(guildId, roles)
        return roles
    }

    suspend fun getUserGuilds(
        server: FoxyWebsite,
        session: UserSession,
        client: HttpClient,
        call: ApplicationCall
    ): List<DiscordServer>? {
        val cachedGuilds = server.guildCache.getIfPresent(session.userId)
        if (cachedGuilds != null) return cachedGuilds
        val response = client.get {
            url(Constants.DISCORD_GUILD_LIST)
            header("Authorization", "${session.tokenType} ${session.accessToken}")
        }

        val body = response.bodyAsText()

        if (!response.status.isSuccess()) {
            val error = server.json.decodeFromString<DiscordAPIError>(body)

            if (error.code == 0) {
                val loginUrl = "/login"
                val isHtmx = call.request.headers["HX-Request"] == "true"

                if (isHtmx) {
                    call.response.headers.append("HX-Redirect", loginUrl)
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respondRedirect(loginUrl)
                }

            } else {
                call.respond(HttpStatusCode.BadGateway)
            }

            return null
        }

        val guilds = server.json.decodeFromString<List<DiscordServer>>(body)

        val authorized = guilds.filter {
            checkUserPermissions(it.permissions)
        }

        server.guildCache.put(session.userId, authorized)

        return authorized
    }


    suspend fun checkPermissions(
        server: FoxyWebsite,
        context: RoutingContext,
        locale: FoxyLocale,
        call: ApplicationCall
    ): PermissionResult? {

        val guildId = context.call.parameters["guildId"] ?: return null
        val session = checkSession(context.call, server, context.call.sessions.get<UserSession>())

        if (session == null) {
            context.call.respondRedirect("/login")
            return null
        }

        val guildInfo = server.foxy.database.guild.getGuildOrNull(guildId)
            ?: run {
                context.call.respondRedirect(Constants.INVITE_LINK)
                return null
            }

        val availableGuilds = server
            .guildCache
            .getIfPresent(session.userId)
            ?: run { return@run this.getUserGuilds(server, session, server.httpClient, call) }

        val guild = availableGuilds?.find { it.id == guildId }
            ?: run {
                context.call.respondRedirect(Constants.INVITE_LINK)
                return null
            }

        val userFromDiscord = server.foxy.shardManager
            .retrieveUserById(session.userId)
            .await()

        if (!checkUserPermissions(guild.permissions)) {
            context.call.respondRedirect("/${locale.language}/dashboard")
            return null
        }

        return PermissionResult(
            user = userFromDiscord,
            guild = guild,
            session = session,
            guildInfo = guildInfo,
            authorizedGuilds = availableGuilds
        )
    }

    suspend fun htmxRedirect(call: ApplicationCall, location: String) {
        call.response.headers.append("HX-Redirect", location)
        call.respondText("")
    }

    fun checkSession(call: RoutingCall, server: FoxyWebsite, session: UserSession?): UserSession? {
        if (session == null) return null

        val expectedHmac = server.generateHmac("${session.userId}:${session.accessToken}")

        return if (session.hmac == expectedHmac) {
            session
        } else {
            call.sessions.clear<UserSession>()
            null
        }
    }

    suspend fun getChannelsFromDiscord(
        server: FoxyWebsite,
        guildId: String,
        call: ApplicationCall
    ): List<DiscordChannel>? {

        val response = server.httpClient.get {
            url("https://discord.com/api/guilds/$guildId/channels")
            header("Authorization", "Bot ${server.config.discord.token}")
        }

        val body = response.bodyAsText()

        if (!response.status.isSuccess()) {
            val error = server.json.decodeFromString<DiscordAPIError>(body)
            when (error.code) {
                50001 -> {
                    call.response.headers.append("HX-Redirect", Constants.getServerInviteLink(guildId))
                    call.respond(HttpStatusCode.NoContent)
                }

                else -> {
                    call.respond(HttpStatusCode.BadGateway)
                }
            }

            return null
        }

        val channels = server.json.decodeFromString(
            ListSerializer(DiscordChannel.serializer()),
            body
        )

        return channels.filter { it.type == 0 }
    }

}