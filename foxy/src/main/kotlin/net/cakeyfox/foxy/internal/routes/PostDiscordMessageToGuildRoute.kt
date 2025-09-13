package net.cakeyfox.foxy.internal.routes

import dev.minn.jda.ktx.coroutines.await
import io.ktor.server.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.http.*
import kotlinx.coroutines.delay
import mu.KotlinLogging
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.utils.messages.MessageCreateBuilder
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.cluster.RelayEmbed
import net.cakeyfox.serializable.data.cluster.RelayMessage
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.exceptions.RateLimitedException
import java.time.Instant
import java.awt.Color

class PostDiscordMessageToGuildRoute() {
    companion object {
        private val logger = KotlinLogging.logger {  }
    }

    fun Route.postDiscordMessageToGuildRoute(foxy: FoxyInstance) {
        post("/api/v1/guilds/{guildId}/{channelId}") {
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
        if (guild == null) {
            call.respond(HttpStatusCode.NotFound, "Guild not found")
            logger.warn { "Guild not found!" }
            return
        }

        val payload = call.receive<RelayMessage>()
        val channel = guild.getTextChannelById(channelId)
        if (channel == null) {
            call.respond(HttpStatusCode.NotFound, "Channel not found")
            logger.warn { "Channel not found" }
            return
        }

        val messageBuilder = MessageCreateBuilder().apply {
            payload.content?.let { setContent(it) }
            payload.embeds?.forEach { embed ->
                addEmbeds(buildEmbed(embed))
            }
        }

        logger.info { "Sending message to $guildId" }
        channel.sendMessage(messageBuilder.build()).await()
    }

    fun buildEmbed(embed: RelayEmbed): MessageEmbed {
        val eb = EmbedBuilder()
        embed.title?.let { eb.setTitle(it, embed.url) }
        embed.description?.let { eb.setDescription(it) }
        embed.color?.let { eb.setColor(Color(it)) }
        embed.timestamp?.let { eb.setTimestamp(Instant.parse(it)) }
        embed.footer?.let { eb.setFooter(it.text, it.icon_url) }
        embed.author?.let { eb.setAuthor(it.name, it.url, it.icon_url) }
        embed.fields?.forEach { f -> eb.addField(f.name, f.value, f.inline) }
        return eb.build()
    }
}