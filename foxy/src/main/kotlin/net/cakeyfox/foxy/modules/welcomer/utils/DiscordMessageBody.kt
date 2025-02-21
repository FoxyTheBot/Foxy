package net.cakeyfox.foxy.modules.welcomer.utils

import kotlinx.serialization.Serializable

@Serializable

data class DiscordMessageBody(
    val content: String? = null,
    val embeds: List<DiscordEmbedBody>? = null
) {
    @Serializable
    data class DiscordEmbedBody(
        val title: String? = null,
        val description: String? = null,
        val color: Int? = null,
        val fields: List<DiscordFieldBody>? = null,
        val image: DiscordImageBody? = null,
        val thumbnail: DiscordImageBody? = null,
        val footer: DiscordFooterBody? = null
    ) {
        @Serializable
        data class DiscordFieldBody(
            val name: String,
            val value: String,
            val inline: Boolean = false
        )

        @Serializable
        data class DiscordFooterBody(
            val text: String,
            val iconUrl: String? = null
        )

        @Serializable
        data class DiscordImageBody(
            val url: String
        )
    }
}
