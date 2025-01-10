package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.antiraid.AntiRaidModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.events.session.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class MajorEventListener(foxy: FoxyInstance): ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val antiRaid = AntiRaidModule(foxy)

    override fun onReady(event: ReadyEvent) {
        coroutineScope.launch {
            logger.info { "Shard #${event.jda.shardInfo.shardId} is ready!" }
        }
    }

    // TODO: Implement a good way to handle messages
//    override fun onMessageReceived(event: MessageReceivedEvent) {
//        coroutineScope.launch {
//            if (event.author.isBot) return@launch
//
//            if (event.isFromGuild) {
//                antiRaid.handleMessage(event)
//            }
//        }
//    }
}