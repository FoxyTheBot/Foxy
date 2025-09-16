package net.cakeyfox.foxy.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.serializable.data.cluster.RelayEmbed
import net.cakeyfox.serializable.data.cluster.RelayEmbedAuthor
import net.cakeyfox.serializable.data.cluster.RelayEmbedField
import net.cakeyfox.serializable.data.cluster.RelayEmbedFooter
import net.dv8tion.jda.api.components.buttons.Button
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.entities.channel.Channel
import net.dv8tion.jda.api.entities.emoji.Emoji

suspend fun joinInAVoiceChannel(context: CommandContext): Channel? {
    val memberVoiceChannel = context.member?.voiceState?.channel
    if (memberVoiceChannel == null) {
        context.reply(true) {
            content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.userNotInVoiceChannel"])
        }
        return null
    }

    val audioManager = context.guild!!.audioManager
    val selfMember = context.guild!!.selfMember
    val botVoiceChannel = selfMember.voiceState?.channel

    if (botVoiceChannel != null && botVoiceChannel != memberVoiceChannel) {
        context.reply(true) {
            content = pretty(FoxyEmotes.FoxyDrinkingCoffee, context.locale["music.play.alreadyConnectedInAnotherChannel", botVoiceChannel.asMention])
        }
        return null
    }

    if (botVoiceChannel == null) {
        audioManager.isSelfDeafened = true
        audioManager.isAutoReconnect = true
        audioManager.openAudioConnection(memberVoiceChannel)
    }

    return memberVoiceChannel
}

fun linkButton(
    emoji: String? = null,
    label: String = "",
    url: String,
): Button {
    return Button.of(
        ButtonStyle.LINK,
        url,
        label,
        emoji?.let { Emoji.fromFormatted(it) }
    )
}

fun MessageEmbed.toRelayEmbed(): RelayEmbed {
    return RelayEmbed(
        title = this.title,
        description = this.description,
        url = this.url,
        color = this.colorRaw,
        timestamp = this.timestamp?.toString(),
        footer = this.footer?.let { RelayEmbedFooter(it.text ?: "", it.iconUrl) },
        author = this.author?.let { RelayEmbedAuthor(it.name ?: "", it.url, it.iconUrl) },
        fields = this.fields.map { f -> RelayEmbedField(f.name ?: "", f.value ?: "", f.isInline) }
    )
}
