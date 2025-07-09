package net.cakeyfox.foxy.listeners

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.channel.ChannelType
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter

class MessageListener(val foxy: FoxyInstance) : ListenerAdapter() {
    override fun onMessageReceived(event: MessageReceivedEvent) {
        if (event.author.isBot || event.isWebhookMessage || event.channelType == ChannelType.PRIVATE) return
        val locale = FoxyLocale(foxy.utils.availableLanguages[event.guild.locale] ?: "en-us")

        if (event.message.contentRaw.startsWith(
                "<@${event.jda.selfUser.id}>"
            ) || event.message.contentRaw.startsWith("<@!${event.jda.selfUser.id}>")
        ) {
            event.channel.sendMessage(
                pretty(FoxyEmotes.FoxyHowdy, locale["greetings", event.author.asMention])
            ).queue()
        }
    }
}