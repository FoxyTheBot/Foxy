package net.cakeyfox.serializable.data.website

import kotlinx.serialization.Serializable

@Serializable
data class DiscordChannel(
    val id: String,
    val type: Int,
    val guild_id: String,
    val name: String,
)