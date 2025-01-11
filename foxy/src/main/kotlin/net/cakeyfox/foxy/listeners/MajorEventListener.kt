package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.antiraid.AntiRaidModule
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.events.session.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import net.dv8tion.jda.api.interactions.DiscordLocale
import kotlin.reflect.jvm.jvmName

class MajorEventListener(foxy: FoxyInstance) : ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val antiRaid = AntiRaidModule(foxy)
    private val parsedLocale = hashMapOf(
        DiscordLocale.PORTUGUESE_BRAZILIAN to "pt-br",
        DiscordLocale.ENGLISH_US to "en-us",
    )

    override fun onReady(event: ReadyEvent) {
        coroutineScope.launch {
            logger.info { "Shard #${event.jda.shardInfo.shardId} is ready!" }
        }
    }

    override fun onMessageReceived(event: MessageReceivedEvent) {
        if (event.author.isBot || event.isWebhookMessage) return
        val locale = FoxyLocale(parsedLocale[event.guild.locale] ?: "en-us")

        if (event.message.contentRaw.startsWith(
                "<@${event.jda.selfUser.id}>"
            ) || event.message.contentRaw.startsWith("<@!${event.jda.selfUser.id}>")
        ) {
            event.channel.sendMessage(
                pretty(FoxyEmotes.FoxyHowdy, locale["greetings", event.author.asMention])
            ).queue()
        }

        // TODO: Implement a good way to handle messages
//        coroutineScope.launch {
//            if (event.author.isBot) return@launch
//
//            if (event.isFromGuild) {
//                antiRaid.handleMessage(event)
//            }
//        }
    }
}