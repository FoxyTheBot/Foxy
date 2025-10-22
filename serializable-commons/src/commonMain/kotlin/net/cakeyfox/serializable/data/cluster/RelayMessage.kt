package net.cakeyfox.serializable.data.cluster

import kotlinx.serialization.Serializable

@Serializable
data class RelayMessage(
    val content: String? = null,
    val embeds: List<RelayEmbed>? = null
)

@Serializable
data class RelayEmbed(
    val title: String? = null,
    val description: String? = null,
    val url: String? = null,
    val color: Int? = null,
    val timestamp: String? = null,
    val footer: RelayEmbedFooter? = null,
    val author: RelayEmbedAuthor? = null,
    val fields: List<RelayEmbedField>? = null,
    val thumbnail: Thumbnail? = null
)

@Serializable
data class Thumbnail(val url: String?)
@Serializable
data class RelayEmbedFooter(val text: String, val icon_url: String? = null)
@Serializable
data class RelayEmbedAuthor(val name: String, val url: String? = null, val icon_url: String? = null)
@Serializable
data class RelayEmbedField(val name: String, val value: String, val inline: Boolean = false)