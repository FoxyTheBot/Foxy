package net.cakeyfox.serializable.data.website

import kotlinx.serialization.Serializable
import net.cakeyfox.serializable.data.utils.DiscordEmbedBody
import net.cakeyfox.serializable.data.utils.DiscordFooterBody
import net.cakeyfox.serializable.data.utils.DiscordImageBody

@Serializable
data class MessageSettings(
    val channel: String? = null,
    val content: String? = null,
    val embedTitle: String? = null,
    val embedDescription: String? = null,
    val embedThumbnail: String? = null,
    val imageLink: String? = null,
    val embedFooter: String? = null
)

@Serializable
enum class EventType {
    JOIN,
    LEAVE,
    DM,
    ANY
}

@Serializable
data class GenericJoinLeaveSettings(
    val toggleWelcomeModule: Boolean = false,
    val toggleDMWelcomeModule: Boolean = false,
    val toggleLeaveModule: Boolean = false,

    val messages: Map<EventType, MessageSettings> = emptyMap()
)

fun MessageSettings.toDiscordEmbedOrNull() =
    if (embedTitle.isNullOrBlank() &&
        embedDescription.isNullOrBlank() &&
        embedThumbnail.isNullOrBlank() &&
        imageLink.isNullOrBlank() &&
        embedFooter.isNullOrBlank()
    ) null
    else {
        DiscordEmbedBody(
            title = embedTitle?.takeIf { it.isNotBlank() },
            description = embedDescription?.takeIf { it.isNotBlank() },
            thumbnail = embedThumbnail?.takeIf { it.isNotBlank() }?.let { DiscordImageBody(url = it) },
            image = imageLink?.takeIf { it.isNotBlank() }?.let { DiscordImageBody(url = it) },
            footer = embedFooter?.takeIf { it.isNotBlank() }?.let { DiscordFooterBody(text = it) }
        )
    }

