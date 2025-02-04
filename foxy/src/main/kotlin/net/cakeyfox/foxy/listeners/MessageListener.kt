package net.cakeyfox.foxy.listeners

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.modules.antiraid.AntiRaidModule
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.channel.ChannelType
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import net.dv8tion.jda.api.interactions.DiscordLocale

class MessageListener(val foxy: FoxyInstance) : ListenerAdapter() {
    private val antiRaid = AntiRaidModule(foxy)
    private val parsedLocale = hashMapOf(
        DiscordLocale.PORTUGUESE_BRAZILIAN to "pt-br",
        DiscordLocale.ENGLISH_US to "en-us",
    )

    override fun onMessageReceived(event: MessageReceivedEvent) {
        if (event.author.isBot || event.isWebhookMessage || event.channelType == ChannelType.PRIVATE) return
        val locale = FoxyLocale(parsedLocale[event.guild.locale] ?: "en-us")

        if (event.message.contentRaw.startsWith(
                "<@${event.jda.selfUser.id}>"
            ) || event.message.contentRaw.startsWith("<@!${event.jda.selfUser.id}>")
        ) {
            event.channel.sendMessage(
                pretty(FoxyEmotes.FoxyHowdy, locale["greetings", event.author.asMention])
            ).queue()
        }

        foxy.threadPoolManager.launchMessageJob(event) {
            if (event.isFromGuild) {
                antiRaid.handleMessage(event)
            }
        }
    }
}