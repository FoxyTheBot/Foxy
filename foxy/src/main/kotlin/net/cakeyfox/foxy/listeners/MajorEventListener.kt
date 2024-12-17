package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.dv8tion.jda.api.OnlineStatus
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.events.interaction.GenericInteractionCreateEvent
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.session.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class MajorEventListener(private val instance: FoxyInstance): ListenerAdapter() {
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val logger = KotlinLogging.logger(this::class.jvmName)

    override fun onGenericInteractionCreate(event: GenericInteractionCreateEvent) {
      coroutineScope.launch {
          when (event) {
              is SlashCommandInteractionEvent -> {
                  val commandName = event.fullCommandName.split(" ").first()
                    if (event.isFromGuild) {
                        // This will be used to create a guild object in the database if it doesn't exist
                        event.guild?.let { instance.mongoClient.guildUtils.getGuild(it.id) }
                    }

                  val command = instance.commandHandler[commandName]?.create()

                  if (command != null) {
                      val context = UnleashedCommandContext(event, instance)

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

                      if (context.db.userUtils.getDiscordUser(event.user.id).isBanned) {
                          instance.utils.handleBan(event, context)
                          return@launch
                      }

                      if (subCommand != null) {
                          subCommand.executor?.execute(context)
                      } else if (subCommandGroupName == null && subCommandName == null) {
                          command.executor?.execute(context)
                      }
                  }
              }
          }
      }
    }

    override fun onReady(event: ReadyEvent) {
        coroutineScope.launch {
            event.jda.presence.setPresence(
                OnlineStatus.ONLINE,
                Activity.customStatus(Constants.DEFAULT_ACTIVITY))

            val commands = instance.commandHandler.handle()
            logger.info { "Registered ${commands?.size} commands" }
        }
    }
}