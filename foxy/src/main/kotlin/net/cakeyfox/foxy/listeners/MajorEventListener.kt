package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.OnlineStatus
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.events.session.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class MajorEventListener(private val instance: FoxyInstance): ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

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