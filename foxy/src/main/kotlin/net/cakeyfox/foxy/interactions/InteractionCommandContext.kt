package net.cakeyfox.foxy.interactions

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import dev.minn.jda.ktx.messages.MessageEditBuilder
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.database.data.user.FoxyUser
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.common.FoxyLocale
import net.dv8tion.jda.api.events.interaction.GenericInteractionCreateEvent
import net.dv8tion.jda.api.events.interaction.ModalInteractionEvent
import net.dv8tion.jda.api.events.interaction.command.MessageContextInteractionEvent
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.interaction.command.UserContextInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.EntitySelectInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.StringSelectInteractionEvent
import net.dv8tion.jda.api.interactions.InteractionHook
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.modals.Modal

class InteractionCommandContext(
    override val event: GenericInteractionCreateEvent,
    override val foxy: FoxyInstance
) : CommandContext {
    override val jda = event.jda
    override val database = foxy.database
    override val userId get() = event.user.id
    override val guildId get() = event.guild?.id
    override val locale = FoxyLocale("pt-br")
    override val utils = FoxyUtils(foxy)
    override val channel = event.channel
    override val guild = event.guild
    override val user = event.user
    override val member = event.member

    private val logger = KotlinLogging.logger { }

    override suspend fun getAuthorData(): FoxyUser = database.user.getFoxyProfile(user.id)
    override suspend fun reply(
        ephemeral: Boolean,
        block: InlineMessage<*>.() -> Unit
    ) {
        val msg = MessageCreateBuilder {
            apply(block)
        }

        return when (event) {
            is SlashCommandInteractionEvent -> {
                try {
                    if (event.isAcknowledged) {
                        event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).queue()
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
                        event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).queue()
                    } else {
                        val defer = defer(ephemeral)

                        defer.sendMessage(msg.build()).queue()
                    }
                } catch (e: Exception) {
                    logger.warn { "Failed to reply button! It was deleted? ${e.message}" }
                }
            }

            is UserContextInteractionEvent -> {
                try {
                    if (event.isAcknowledged) {
                        event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).queue()
                    } else {
                        val defer = defer(ephemeral)

                        defer.sendMessage(msg.build()).queue()
                    }
                } catch (e: Exception) {
                    logger.warn { "Failed to reply button! It was deleted? ${e.message}" }
                }
            }

            is MessageContextInteractionEvent -> {
                try {
                    if (event.isAcknowledged) {
                        event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).queue()
                    } else {
                        val defer = defer(ephemeral)

                        defer.sendMessage(msg.build()).queue()
                    }
                } catch (e: Exception) {
                    logger.warn { "Failed to reply button! It was deleted? ${e.message}" }
                }
            }

            is EntitySelectInteractionEvent -> {
                try {
                    if (event.isAcknowledged) {
                        event.hook
                    } else {
                        event.deferReply().setEphemeral(ephemeral).queue()
                    }
                } catch (e: Exception) {
                    logger.warn { "Failed to reply entity select! It was deleted? ${e.message}" }
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
                    logger.warn { "Failed to reply string select! It was deleted? ${e.message}" }
                }
            }

            is ModalInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.setEphemeral(ephemeral).sendMessage(msg.build()).await()
                } else {
                    val defer = defer(ephemeral)

                    defer.sendMessage(msg.build()).await()
                }
            }

            else -> throw IllegalStateException("Cannot reply to this event type")
        } as Unit
    }

    @Suppress("UNCHECKED_CAST")
    override fun <T> getOption(name: String, argNumber: Int, type: Class<T>, isFullString: Boolean): T? {
        val option = if (event is SlashCommandInteractionEvent) {
            event.getOption(name)
        } else null

        return when (option?.type) {
            OptionType.USER -> option.asUser
            OptionType.INTEGER -> option.asLong
            OptionType.CHANNEL -> option.asChannel
            OptionType.BOOLEAN -> option.asBoolean
            OptionType.STRING -> option.asString
            OptionType.ROLE -> option.asRole
            OptionType.ATTACHMENT -> option.asAttachment
            else -> null
        } as T?
    }

    override suspend fun deferEdit(): InteractionHook? {
        return when (event) {
            is ButtonInteractionEvent -> {
                event.deferEdit().await()
            }

            is ModalInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook
                } else {
                    event.deferEdit().await()
                }
            }

            is EntitySelectInteractionEvent -> {
                event.deferEdit().await()
            }

            is StringSelectInteractionEvent -> {
                event.deferEdit().await()
            }

            else -> throw IllegalStateException("Cannot defer edit this event type")
        }
    }

    override suspend fun edit(block: InlineMessage<*>.() -> Unit): Unit? {
        val msg = MessageEditBuilder {
            apply(block)
        }

        return when (event) {
            is SlashCommandInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.editOriginal(msg.build()).queue()
                } else null
            }

            is ButtonInteractionEvent -> {
                if (event.isAcknowledged) {
                    event.hook.editOriginal(msg.build()).queue()
                } else {
                    event.deferEdit().await()?.editOriginal(msg.build())?.queue()
                }
            }

            is EntitySelectInteractionEvent -> {
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

    override suspend fun defer(ephemeral: Boolean): InteractionHook = when (event) {
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

        is UserContextInteractionEvent -> {
            if (event.isAcknowledged) {
                event.hook
            } else {
                event.deferReply().setEphemeral(true).await()
            }
        }

        is MessageContextInteractionEvent -> {
            if (event.isAcknowledged) {
                event.hook
            } else {
                event.deferReply().setEphemeral(true).await()
            }
        }

        is ModalInteractionEvent -> {
            if (event.isAcknowledged) {
                event.hook
            } else {
                event.deferReply().setEphemeral(ephemeral).await()
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
                logger.warn { "Failed to defer button! It was deleted? ${e.message}" }
                event.hook
            }
        }

        else -> throw IllegalStateException("Cannot defer this event type")
    }

    override suspend fun sendModal(modal: Modal) = when (event) {
        is SlashCommandInteractionEvent -> event.replyModal(modal).await()
        is ButtonInteractionEvent -> event.replyModal(modal).await()
        is StringSelectInteractionEvent -> event.replyModal(modal).await()
        else -> throw IllegalStateException("Cannot send modal to this event type.")
    }

    override fun getValue(name: String) = when (event) {
        is ModalInteractionEvent -> event.getValue(name)
        else -> throw IllegalStateException("Cannot get value from this event type.")
    }
}