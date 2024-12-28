package net.cakeyfox.foxy.command

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import dev.minn.jda.ktx.messages.MessageEditBuilder
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance

import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.serializable.database.data.FoxyUser
import net.dv8tion.jda.api.events.interaction.GenericInteractionCreateEvent
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.StringSelectInteractionEvent
import net.dv8tion.jda.api.interactions.DiscordLocale
import net.dv8tion.jda.api.interactions.InteractionHook
import net.dv8tion.jda.api.interactions.commands.OptionType
import kotlin.reflect.jvm.jvmName

class FoxyInteractionContext(
    val event: GenericInteractionCreateEvent, client: FoxyInstance
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    val jda = event.jda
    val foxy = client
    val db = foxy.mongoClient
    private val parsedLocale = hashMapOf(
        DiscordLocale.PORTUGUESE_BRAZILIAN to "pt-br",
        DiscordLocale.ENGLISH_US to "en-us",
    )
    val locale = FoxyLocale(parsedLocale[event.userLocale] ?: "en-us")
    val utils = FoxyUtils(foxy)
    val user = event.user
    val guild = event.guild

    suspend fun getAuthorData(): FoxyUser {
        return db.utils.user.getDiscordUser(user.id)
    }

    suspend fun reply(ephemeral: Boolean = false, block: InlineMessage<*>.() -> Unit): Any? {
        val msg = MessageCreateBuilder {
            apply(block)
        }

        return when (event) {
            is SlashCommandInteractionEvent -> {
                try {
                    if (event.isAcknowledged) {
                        event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).await()
                    } else {
                        val defer = defer(ephemeral)

                        defer.sendMessage(msg.build()).queue()
                    }
                } catch (e: Exception) {
                    logger.warn { "Failed to reply command! It was deleted? ${e.message}" }
                }
            }

            is ButtonInteractionEvent -> {
                try {
                    if (event.isAcknowledged) {
                        event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).await()
                    } else {
                        val defer = defer(ephemeral)
                        defer.sendMessage(msg.build()).queue()
                    }
                } catch (e: Exception) {
                    logger.warn { "Failed to reply button! It was deleted? ${e.message}"}
                }
            }

            is StringSelectInteractionEvent -> {
                try {
                    if (event.isAcknowledged) {
                        event.hook
                    } else {
                        event.deferReply().setEphemeral(ephemeral).queue()
                    }
                } catch (e: Exception) {
                    logger.warn { "Failed to reply string select! It was deleted? ${e.message}"}
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

    suspend fun edit(block: InlineMessage<*>.() -> Unit): Unit? {
        val msg = MessageEditBuilder {
            apply(block)
        }

        return when (event) {
            is ButtonInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.editOriginal(msg.build()).queue()
                } else {
                    event.deferEdit().await()?.editOriginal(msg.build())?.queue()
                }
            }

            is StringSelectInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.editOriginal(msg.build()).queue()
                } else {
                    event.deferEdit().await()?.editOriginal(msg.build())?.queue()
                }
            }

            else -> throw IllegalStateException("Cannot edit this event type. ${event.javaClass}")
        }
    }

    suspend fun defer(ephemeral: Boolean = false): InteractionHook = when (event) {
        is SlashCommandInteractionEvent -> {
            try {
                if (event.isAcknowledged) {
                    event.hook
                } else {
                    event.deferReply().setEphemeral(ephemeral).await()
                }
            } catch (e: Exception) {
                logger.warn { "Failed to defer command! It was deleted? ${e.message}" }
                event.hook
            }
        }

        is ButtonInteractionEvent -> {
            try {
                if (event.isAcknowledged) {
                    event.hook
                } else {
                    event.deferReply().setEphemeral(ephemeral).await()
                }
            } catch (e: Exception) {
                logger.warn { "Failed to defer button! It was deleted? ${e.message}"}
                event.hook
            }
        }

        else -> throw IllegalStateException("Cannot defer this event type")
    }
}