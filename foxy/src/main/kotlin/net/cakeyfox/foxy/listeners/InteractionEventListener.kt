package net.cakeyfox.foxy.listeners

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.component.ComponentId
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.events.interaction.GenericInteractionCreateEvent
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent
import net.dv8tion.jda.api.events.interaction.component.StringSelectInteractionEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class InteractionEventListener(
    private val foxy: FoxyInstance
) : ListenerAdapter() {
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val logger = KotlinLogging.logger(this::class.jvmName)

    override fun onGenericInteractionCreate(event: GenericInteractionCreateEvent) {
        coroutineScope.launch {
            when (event) {
                is SlashCommandInteractionEvent -> {
                    val commandName = event.fullCommandName.split(" ").first()
                    if (event.isFromGuild) {
                        // This will be used to create a guild object in the database if it doesn't exist
                        event.guild?.let { foxy.mongoClient.utils.guild.getGuild(it.id) }
                    }

                    val command = foxy.commandHandler[commandName]?.create()

                    if (command != null) {
                        val context = FoxyInteractionContext(event, foxy)

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

                        if (context.db.utils.user.getDiscordUser(event.user.id).isBanned == true) {
                            foxy.utils.handleBan(event, context)
                            return@launch
                        }

                        try {
                            if (subCommand != null) {
                                subCommand.executor?.execute(context)
                            } else if (subCommandGroupName == null && subCommandName == null) {
                                command.executor?.execute(context)
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

                        logger.info { "${context.user.name} (${context.user.id}) executed ${event.fullCommandName} in ${context.guild?.name ?: "DM"} (${context.guild?.id ?: "Can't get ID"})" }
                    }
                }

                is ButtonInteractionEvent -> {
                    val componentId = try {
                        ComponentId(event.componentId)
                    } catch (e: IllegalArgumentException) {
                        logger.info { "Invalid component ID: ${event.componentId}" }
                        return@launch
                    }

                    val callbackId = foxy.interactionManager.componentCallbacks[componentId.uniqueId]
                    val context = FoxyInteractionContext(event, foxy)

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
        }
    }
    
    override fun onStringSelectInteraction(event: StringSelectInteractionEvent) {
        coroutineScope.launch {
            val componentId = try {
                ComponentId(event.componentId)
            } catch (e: IllegalArgumentException) {
                logger.info { "Unknown component received" }
                return@launch
            }

            try {
                val callback = foxy.interactionManager.stringSelectMenuCallbacks[componentId.uniqueId]
                val context = FoxyInteractionContext(
                    event,
                    foxy
                )

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