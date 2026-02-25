package net.cakeyfox.foxy.interactions

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import dev.minn.jda.ktx.messages.MessageEditBuilder
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.foxy.database.data.user.FoxyUser
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.common.FoxyLocale
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.entities.channel.Channel
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel
import net.dv8tion.jda.api.entities.channel.concrete.PrivateChannel
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.interactions.InteractionHook
import net.dv8tion.jda.api.interactions.modals.Modal
import net.dv8tion.jda.api.interactions.modals.ModalMapping

class MessageCommandContext(
    override val event: MessageReceivedEvent,
    override val foxy: FoxyInstance
) : CommandContext {
    override val jda = event.jda
    override val database = foxy.database
    override val userId get() = event.author.id
    override val guildId get() = event.guild.id
    override val locale = FoxyLocale("pt-br")
    override val utils = FoxyUtils(foxy)
    override val channel = event.channel
    override val guild = event.guild
    override val user = event.author
    override val member = event.member

    private val logger = KotlinLogging.logger { }

    override suspend fun getAuthorData(): FoxyUser = database.user.getFoxyProfile(userId)
    override suspend fun getGuildData(): Guild? = database.guild.getGuildOrNull(guildId)

    override suspend fun reply(ephemeral: Boolean, block: InlineMessage<*>.() -> Unit) {
        val msg = MessageCreateBuilder {
            apply(block)
        }

        val channel = event.channel
        val hasTextContent = event.message.contentRaw.isNotBlank()
        val canSendMessage = when (channel) {
            is TextChannel -> channel.canTalk()
            is PrivateChannel -> true
            else -> false
        }

        if (hasTextContent && canSendMessage) {
            val original = channel.retrieveMessageById(event.messageId).await()
            if (original.isWebhookMessage) return

            channel.sendTyping().queue()

            val shouldDelete = getGuildData()?.guildSettings?.deleteMessageIfCommandIsExecuted

            if (shouldDelete == true) {
                original.delete().await()
                channel.sendMessage(msg.build()).await()
            } else {
                original.reply(msg.build()).await()
            }
        } else {
            logger.warn {
                val reason = when {
                    !hasTextContent -> "Message has no text content."
                    else -> "Bot can't talk in channel ${channel.name}."
                }
                "Cannot reply to message: $reason"
            }
        }
    }

    override suspend fun defer(ephemeral: Boolean): InteractionHook? {
        val channel = event.channel
        val canSendMessage = when (channel) {
            is TextChannel -> channel.canTalk()
            is PrivateChannel -> true
            else -> false
        }

        if (canSendMessage) {
            channel.sendTyping().queue()
        } else {
            logger.warn { "Cannot defer message: Bot can't talk in channel ${channel.name}." }
        }

        return null
    }

    override suspend fun edit(block: InlineMessage<*>.() -> Unit) {
        val message = event.message
        val channel = event.channel

        val msg = MessageEditBuilder {
            apply(block)
        }

        if (channel is TextChannel || channel is PrivateChannel) {
            channel.editMessageById(message.id, msg.build()).queue()
        } else {
            logger.warn { "Cannot edit message in channel type: ${channel.type}" }
        }
    }


    @Suppress("UNCHECKED_CAST")
    override fun <T> getOption(
        name: String,
        argNumber: Int,
        type: Class<T>,
        isFullString: Boolean
    ): T? {
        val args = event.message.contentRaw.split("\\s+".toRegex()).drop(1)

        if (argNumber >= args.size) return null

        return try {
            when (type) {
                User::class.java -> {
                    val arg = args[argNumber]
                    val id = arg.removePrefix("<@!").removePrefix("<@").removeSuffix(">")
                    jda.getUserById(id)
                }

                Long::class.java -> {
                    val arg = args[argNumber]
                    arg.toLongOrNull()
                }

                Int::class.java -> {
                    val arg = args[argNumber]
                    arg.toIntOrNull()
                }

                Boolean::class.java -> {
                    val arg = args[argNumber]
                    arg.toBooleanStrictOrNull()
                }

                String::class.java -> {
                    if (isFullString) {
                        args.drop(argNumber).joinToString(" ")
                    } else {
                        args[argNumber]
                    }
                }

                Channel::class.java -> {
                    args[argNumber]
                }

                else -> null
            } as? T
        } catch (_: Exception) {
            null
        }
    }

    override suspend fun sendModal(modal: Modal): Void? {
        TODO("Not yet implemented")
    }

    override fun getValue(name: String): ModalMapping? {
        TODO("Not yet implemented")
    }

    override suspend fun deferEdit(): InteractionHook? {
        TODO("Not yet implemented")
    }
}