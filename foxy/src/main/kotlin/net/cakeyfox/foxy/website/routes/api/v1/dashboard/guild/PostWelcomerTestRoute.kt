package net.cakeyfox.foxy.website.routes.api.v1.dashboard.guild

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.header
import io.ktor.server.request.receive
import io.ktor.server.response.respondRedirect
import io.ktor.server.response.respondText
import io.ktor.server.routing.RoutingContext
import kotlinx.serialization.json.Json
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.utils.PlaceholderUtils.getAllPlaceholders
import net.cakeyfox.foxy.utils.discord.DiscordMessageUtils.getMessageFromJson
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils
import net.cakeyfox.foxy.website.utils.RouteUtils.checkPermissions
import net.cakeyfox.serializable.data.utils.DiscordMessageBody
import net.cakeyfox.serializable.data.website.MessageSettings
import net.cakeyfox.serializable.data.website.toDiscordEmbedOrNull
import net.dv8tion.jda.api.components.buttons.ButtonStyle

class PostWelcomerTestRoute(val server: FoxyWebsite) :
    BaseRoute("/api/v1/servers/{guildId}/modules/welcomer/{action}") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val guildId = context.call.parameters["guildId"] ?: return
        val action = context.call.parameters["action"] ?: return
        val guildData = server.foxy.database.guild.getGuildOrNull(guildId)
        val body = context.call.receive<MessageSettings>()
        val idempotencyKey = context.call.request.header("Foxy-Idempotency-Key") ?: return println("Missing key")
        val locked = RouteUtils.tryLockForm(server, guildId, idempotencyKey)

        if (!locked) return

        if (guildData == null) {
            return context.call.respondRedirect(Constants.INVITE_LINK)
        }

        val (user, guild, session, guildInfo) = checkPermissions(server, context, locale, context.call) ?: return

        val bodyAsDiscordMessage = Json.encodeToString(
            DiscordMessageBody(
                content = body.content,
                embeds = listOfNotNull(body.toDiscordEmbedOrNull())
            )
        )

        val placeholders = getAllPlaceholders(guild, user)
        val (content, embeds) = getMessageFromJson(bodyAsDiscordMessage, placeholders)

        if (action == "sendDmWelcomeTest") {
            server.foxy.utils.sendDirectMessage(user) {
                this.content = content

                if (embeds.isNotEmpty()) {
                    this.embeds.plusAssign(embeds.first())
                }

                actionRow(
                    server.foxy.interactionManager.createButtonForUser(
                        server.foxy.shardManager.shards.first().selfUser,
                        ButtonStyle.SECONDARY,
                        emoji = FoxyEmotes.FoxyPlush,
                        label = "Mensagem enviada através do painel de controle"
                    ) { }.asDisabled()
                )
            }

            context.call.respondText("OK", status = HttpStatusCode.OK)
        }

        if (body.channel == null) return println("Empty body")

        server.foxy.utils.sendMessageToAGuildChannel(guildInfo, body.channel!!) {
            this.content = content

            if (embeds.isNotEmpty()) {
                this.embeds.plusAssign(embeds.first())
            }

            actionRow(
                server.foxy.interactionManager.createButtonForUser(
                    server.foxy.shardManager.shards.first().selfUser,
                    ButtonStyle.SECONDARY,
                    emoji = FoxyEmotes.FoxyPlush,
                    label = "Mensagem enviada através do painel de controle"
                ) { }.asDisabled()
            )
        }

        RouteUtils.removeFormLock(server, guildId)
        context.call.respondText("OK", status = HttpStatusCode.OK)
    }
}