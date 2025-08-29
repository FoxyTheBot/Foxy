package net.cakeyfox.foxy.utils

import net.cakeyfox.serializable.data.cluster.RelayEmbed
import net.cakeyfox.serializable.data.cluster.RelayEmbedAuthor
import net.cakeyfox.serializable.data.cluster.RelayEmbedField
import net.cakeyfox.serializable.data.cluster.RelayEmbedFooter
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.entities.emoji.Emoji
import net.dv8tion.jda.api.interactions.components.buttons.Button
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

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
