package net.cakeyfox.serializable.data.website

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@kotlinx.serialization.Serializable
data class DiscordRole(
    val id: String,
    val name: String,
    val position: Int,
    val managed: Boolean,
    val colors: DiscordColorObject
) {
    @Serializable
    data class DiscordColorObject(
        @SerialName("primary_color")
        val primaryColor: Int,
    )
}
