package net.cakeyfox.foxy.listeners

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.ComponentId
import net.cakeyfox.foxy.interactions.InteractionCommandContext
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.isEarlyAccessOnlyCommand
import net.dv8tion.jda.api.entities.channel.ChannelType
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.StringSelectInteractionEvent
import net.dv8tion.jda.api.events.session.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName
import kotlin.system.measureTimeMillis

class InteractionsListener(
    private val foxy: FoxyInstance
) : ListenerAdapter() {
    private val coroutineScope = CoroutineScope(foxy.coroutineDispatcher + SupervisorJob())
    private val logger = KotlinLogging.logger(this::class.jvmName)

    override fun onReady(event: ReadyEvent) {
        logger.info { "Shard #${event.jda.shardInfo.shardId} is ready!" }
    }

    override fun onSlashCommandInteraction(event: SlashCommandInteractionEvent) {
        foxy.threadPoolManager.launchMessageJob(event) {
            val commandName = event.fullCommandName.split(" ").first()
            val command = foxy.commandHandler[commandName]?.create()

            if (command != null) {
                val context = InteractionCommandContext(event, foxy)

                val subCommandGroupName = event.subcommandGroup
                val subCommandName = event.subcommandName

                val subCommandGroup =
                    if (subCommandGroupName != null)
                        command.getSubCommandGroup(subCommandGroupName) else null
                val subCommand = if (subCommandName != null) {
                    if (subCommandGroup != null) {
                        subCommandGroup.getSubCommand(subCommandName)
                    } else {
                        command.getSubCommand(subCommandName)
                    }
                } else null

                if (context.database.user.getFoxyProfile(event.user.id).isBanned == true) {
                    foxy.utils.handleBan(event, context)
                    return@launchMessageJob
                }

                try {
                    val executionTime = measureTimeMillis {
                        if (subCommand != null) {
                            isEarlyAccessOnlyCommand(context, subCommand)
                        } else if (subCommandGroupName == null && subCommandName == null) {
                            isEarlyAccessOnlyCommand(context, command)
                        }
                    }
                    if (event.channelType == ChannelType.PRIVATE) {
                        logger.info { "${context.user.name} (${context.user.id}) executed ${event.fullCommandName} on a private channel in ${executionTime}ms" }
                    } else {
                        logger.info { "${context.user.name} (${context.user.id}) executed ${event.fullCommandName} in ${context.guild?.name} (${context.guild?.id}) in ${executionTime}ms" }
                    }
                } catch (e: Exception) {
                    logger.error(e) { "An error occurred while executing command: ${event.fullCommandName}" }
                    context.reply(true) {
                        content = pretty(
                            FoxyEmotes.FoxyCry,
                            context.locale["commands.error", e.toString()]
                        )
                    }
                }
            }

            foxy.database.bot.updateCommandUsage(event.name)
        }
    }

    override fun onButtonInteraction(event: ButtonInteractionEvent) {
        coroutineScope.launch {
            val componentId = try {
                ComponentId(event.componentId)
            } catch (_: IllegalArgumentException) {
                logger.info { "Invalid component ID: ${event.componentId}" }
                return@launch
            }

            val callbackId = foxy.interactionManager.componentCallbacks[componentId.uniqueId]
            val context = InteractionCommandContext(event, foxy)

            if (callbackId == null) {
                event.editButton(
                    event.button.asDisabled()
                ).await()

                context.reply(true) {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["commands.componentExpired"]
                    )
                }

                return@launch
            }

            callbackId.invoke(context)
        }
    }

    override fun onStringSelectInteraction(event: StringSelectInteractionEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            val componentId = try {
                ComponentId(event.componentId)
            } catch (_: IllegalArgumentException) {
                logger.info { "Unknown component received" }
                return@launch
            }

            try {
                val callback = foxy.interactionManager.stringSelectMenuCallbacks[componentId.uniqueId]
                val context = InteractionCommandContext(event, foxy)

                if (callback == null) {
                    event.editSelectMenu(
                        event.selectMenu.asDisabled()
                    ).await()

                    context.reply(true) {
                        content = pretty(
                            FoxyEmotes.FoxyCry,
                            context.locale["commands.componentExpired"]
                        )
                    }

                    return@launch
                }

                callback.invoke(context, event.values)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}