package net.cakeyfox.foxy.command

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import dev.minn.jda.ktx.messages.MessageEditBuilder
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.dv8tion.jda.api.entities.ISnowflake
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.events.interaction.GenericInteractionCreateEvent
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.StringSelectInteractionEvent
import net.dv8tion.jda.api.interactions.DiscordLocale
import net.dv8tion.jda.api.interactions.commands.OptionType

class FoxyInteractionContext(
    val event: GenericInteractionCreateEvent, client: FoxyInstance
) {
    val jda = event.jda
    val instance = client
    val db = instance.mongoClient
    private val parsedLocale = hashMapOf(
        DiscordLocale.PORTUGUESE_BRAZILIAN to "pt-br",
        DiscordLocale.ENGLISH_US to "en-us",
    )
    val locale = FoxyLocale(parsedLocale[event.userLocale] ?: "en-us")
    val utils = FoxyUtils(instance)
    val user = event.user
    val authorData = db.utils.user.getDiscordUser(user.id)
    val guild = event.guild

    suspend fun reply(ephemeral: Boolean = false, block: InlineMessage<*>.() -> Unit): ISnowflake? {
        val msg = MessageCreateBuilder {
            apply(block)
        }

        return when (event) {
            is SlashCommandInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).await()
                } else {
                    val defer = defer(ephemeral)

                    defer?.sendMessage(msg.build())?.await()
                }
            }

            is ButtonInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).await()
                } else {
                    val defer = defer(ephemeral)
                    defer?.sendMessage(msg.build())?.await()
                }
            }

            is StringSelectInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook
                } else {
                    event.deferReply().setEphemeral(ephemeral).await()
                }
            }

            else -> throw IllegalStateException("Cannot reply to this event type")
        }
    }

    inline fun <reified T> getOption(name: String): T? {
        val option = if (event is SlashCommandInteractionEvent) {
            event.getOption(name)
        } else null

        return when (option?.type) {
            OptionType.USER -> option.asUser as T
            OptionType.INTEGER -> option.asLong as T
            OptionType.CHANNEL -> option.asChannel as T
            OptionType.BOOLEAN -> option.asBoolean as T
            OptionType.STRING -> option.asString as T
            OptionType.ROLE -> option.asRole as T
            OptionType.ATTACHMENT -> option.asAttachment as T
            else -> null
        }
    }

    suspend fun edit(block: InlineMessage<*>.() -> Unit): Message? {
        val msg = MessageEditBuilder {
            apply(block)
        }

        return when (event) {
            is ButtonInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.editOriginal(msg.build()).await()
                } else {
                    event.deferEdit().await()?.editOriginal(msg.build())?.await()
                }
            }

            is StringSelectInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.editOriginal(msg.build()).await()
                } else {
                    event.deferEdit().await()?.editOriginal(msg.build())?.await()
                }
            }

            else -> throw IllegalStateException("Cannot edit this event type.")
        }
    }

    suspend fun defer(ephemeral: Boolean = false) = when (event) {
        is SlashCommandInteractionEvent -> {
            if (event.isAcknowledged) {
                event.hook
            } else {
                event.deferReply().setEphemeral(ephemeral).await()
            }
        }

        is ButtonInteractionEvent -> {
            if (event.isAcknowledged) {
                event.hook
            } else {
                event.deferReply().setEphemeral(ephemeral).await()
            }
        }

        else -> throw IllegalStateException("Cannot defer this event type")
    }

    fun prettyResponse(reply: ReplyBuilder.() -> Unit): String {
        val response = ReplyBuilder().apply(reply)

        if (response.unicodeEmote != null) {
            return "${response.unicodeEmote} **|** ${response.content}"
        }

        return "<:emoji:${response.emoteId}> **|** ${response.content}"
    }
}

data class ReplyBuilder(
    var emoteId: String? = "1070906796274888795",
    var content: String = "",
    var unicodeEmote: String? = null
)