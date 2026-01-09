package net.cakeyfox.foxy.interactions.vanilla.moderation

import com.github.benmanes.caffeine.cache.Caffeine
import kotlinx.coroutines.future.asDeferred
import kotlinx.coroutines.future.await
import kotlinx.coroutines.joinAll
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.channel.middleman.GuildMessageChannel
import java.util.Collections
import java.util.concurrent.TimeUnit

class ClearExecutor : UnleashedCommandExecutor() {
    companion object {
        private val MAX_RANGE = 1000.toLong()
    }

    private val unavailableGuilds = Collections.newSetFromMap(
        Caffeine.newBuilder()
            .expireAfterWrite(MAX_RANGE / 100, TimeUnit.SECONDS)
            .build<Long, Boolean>().asMap()
    )

    override suspend fun execute(context: CommandContext) {
        val users = context.getOption("users", 0, String::class.java)
        val quantity = context.getOption("quantity", 1, Long::class.java)!!

        if (unavailableGuilds.contains(context.guild?.idLong)) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyHm,
                    context.locale["clear.operationQueued"]
                )
            }

            return
        }

        val validUsers = if (users != null) {
            val validUsers = context.utils.checkValidUsersFromString(context, users)?.validUsers
                ?: return sendHelpEmbed(context)

            if (validUsers.isEmpty() && users.isEmpty()) return sendHelpEmbed(context)

            validUsers
        } else emptyList()

        val channel = context.channel as? GuildMessageChannel ?: return

        if (quantity !in 2..MAX_RANGE) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyRage,
                    context.locale["clear.youCanDeleteOnlyTwoOrFiveHundredMessages"]
                )
            }
            return
        }

        val messagesToBeIgnored = mutableListOf<Message>()

        val messages = channel.iterableHistory.takeAsync(quantity.toInt()).await()
        val allowedMessages = messages.getAllowedMessages(
            validUsers.map { it.idLong }.toSet()
        )
            .minus(messagesToBeIgnored)
            .minus(messagesToBeIgnored.toSet())

        if (allowedMessages.isEmpty()) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["clear.noMessageToDelete"]
                )
            }
            return
        }

        clear(context, allowedMessages)
    }

    private fun List<Message>.getAllowedMessages(targets: Set<Long>) = filter {
        (((System.currentTimeMillis() / 1000) - it.timeCreated.toEpochSecond()) < 1209600)
                && (it.isPinned.not())
                && (if (targets.isNotEmpty()) targets.contains(it.author.idLong) else true)
    }

    private suspend fun clear(context: CommandContext, messages: List<Message>) {
        val channel = context.channel as? GuildMessageChannel ?: return
        this@ClearExecutor.unavailableGuilds.add(context.guild!!.idLong)
        channel.purgeMessages(messages)
            .map { it.asDeferred() }.joinAll()

        this@ClearExecutor.unavailableGuilds.remove(context.guild!!.idLong)

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyYay,
                context.locale["clear.deletedMessages", messages.size.toString()]
            )
        }
    }

    private suspend fun sendHelpEmbed(context: CommandContext) {
        context.reply {
            embed {
                color = Colors.FOXY_DEFAULT
                title = pretty(FoxyEmotes.FoxyRage, context.locale["clear.howToUse.title"])
                description = context.locale["clear.howToUse.description"]

                field(
                    context.locale["clear.howToUse.params.quantity.title"],
                    context.locale["clear.howToUse.params.quantity.description"],
                    inline = false
                )
                field(
                    context.locale["clear.howToUse.params.users.title"],
                    context.locale["clear.howToUse.params.users.description"],
                    inline = false
                )

                footer(context.locale["howToUseParams"])
            }
        }
    }
}