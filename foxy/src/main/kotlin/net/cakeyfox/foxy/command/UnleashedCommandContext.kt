package net.cakeyfox.foxy.command

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.interactions.DiscordLocale
import java.util.*

class UnleashedCommandContext(val event: SlashCommandInteractionEvent, client: FoxyInstance) {
    val jda = event.jda
    val instance = client
    val db = instance.mongoClient
    private val parsedLocale = hashMapOf(
        DiscordLocale.PORTUGUESE_BRAZILIAN to "pt-br",
        DiscordLocale.ENGLISH_US to "en-us",
    )
    val authorData = instance.mongoClient.getDiscordUser(event.user.id)
    val locale = FoxyLocale(parsedLocale[event.userLocale] ?: "pt-br")


    suspend fun reply(ephemeral: Boolean = false, block: InlineMessage<*>.() -> Unit): Message? {
        val msg = MessageCreateBuilder {
            apply(block)
        }

        if (event.isAcknowledged) {
            return event.hook.sendMessage(msg.build()).await()
        } else {
            var defer = event.deferReply(ephemeral).await()

            return defer.sendMessage(msg.build()).await()
        }
    }

    suspend fun defer(ephemeral: Boolean = false) {
        event.deferReply(ephemeral).await()
    }

    fun makeReply(emoteId: String, content: String): String {
        return "<:emoji:$emoteId> **|** $content"
    }
}