package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.antiraid.AntiRaidSystem
import net.cakeyfox.foxy.utils.analytics.TopggStatsSender
import net.dv8tion.jda.api.OnlineStatus
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.events.session.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class MajorEventListener(private val instance: FoxyInstance): ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val antiRaid = AntiRaidSystem(instance)
    private val topggStats = TopggStatsSender(instance)

    override fun onReady(event: ReadyEvent) {
        coroutineScope.launch {
            event.jda.presence.setPresence(
                OnlineStatus.ONLINE,
                Activity.customStatus(Constants.DEFAULT_ACTIVITY(instance.environment)))

            val commands = instance.commandHandler.handle()
            logger.info { "Registered ${commands?.size} commands" }

            if (instance.environment == "production") {
                topggStats.send(event.jda.guildCache.size())
            }
        }
    }

    override fun onMessageReceived(event: MessageReceivedEvent) {
        coroutineScope.launch {
            if (event.author.isBot) return@launch

            antiRaid.handleMessage(event)
        }
    }
}