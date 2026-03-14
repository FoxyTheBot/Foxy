package net.cakeyfox.foxy.internal.routes

import dev.minn.jda.ktx.messages.InlineEmbed
import io.ktor.server.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.http.*
import kotlinx.coroutines.delay
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.cluster.RelayEmbed
import net.cakeyfox.serializable.data.cluster.RelayMessage
import net.dv8tion.jda.api.exceptions.RateLimitedException
import java.time.Instant

class PostDiscordMessageToGuildRoute() {
    companion object {
        private val logger = KotlinLogging.logger {  }
    }

    fun Route.postDiscordMessageToGuildRoute(foxy: FoxyInstance) {
        post("/api/v1/guilds/{guildId}/channels/{channelId}/send") {
            val guildId = call.parameters["guildId"] ?: return@post call.respond(HttpStatusCode.BadRequest, "Missing guildId")
            val channelId = call.parameters["channelId"] ?: return@post call.respond(HttpStatusCode.BadRequest, "Missing channelId")

            try {
                delay(1_500L)
                sendMessage(foxy, call, guildId, channelId)

            } catch (e: RateLimitedException) {
                val retryAfter = e.retryAfter
                logger.warn { "Rate limited. Retrying after ${retryAfter}ms" }
                delay(retryAfter)
                sendMessage(foxy, call, guildId, channelId)
            }

            call.respond(HttpStatusCode.OK, "Message sent")
        }
    }

    suspend fun sendMessage(foxy: FoxyInstance, call: RoutingCall, guildId: String, channelId: String) {
        val guild = foxy.shardManager.getGuildById(guildId)
        val guildData = foxy.database.guild.getGuild(guildId)

        if (guild == null) {
            call.respond(HttpStatusCode.NotFound, "Guild not found")
            logger.warn { "Guild not found!" }
            return
        }

        val payload = call.receive<RelayMessage>()
        val channel = guild.getGuildChannelById(channelId)

        if (channel == null) {
            call.respond(HttpStatusCode.NotFound, "Discord channel not found!")
            logger.warn { "Discord channel not found!" }
            return
        }

        foxy.utils.sendMessageToAGuildChannel(
            guildData,
            channel.id,
            canSendAsAnnouncement = true
        ) {
            content = payload.content

            payload.embeds?.forEach { relayEmbed ->
                embed {
                    applyRelayEmbed(relayEmbed)
                }
            }
        }
    }

    fun InlineEmbed.applyRelayEmbed(embed: RelayEmbed) {
        embed.title?.let { title = it }
        embed.url?.let { url = it }

        embed.description?.let { description = it }
        embed.color?.let { color = it }
        embed.timestamp?.let { timestamp = Instant.parse(it) }

        embed.footer?.let {
            footer {
                name = it.text
                iconUrl = it.icon_url
            }
        }

        embed.author?.let {
            author {
                name = it.name
                url = it.url
                iconUrl = it.icon_url
            }
        }

        embed.fields?.forEach {
            field {
                name = it.name
                value = it.value
                inline = it.inline
            }
        }
    }
}