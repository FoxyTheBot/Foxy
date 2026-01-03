package net.cakeyfox.serializable.data.website

import kotlinx.serialization.Serializable

@Serializable
data class DiscordUser(
    val id: String,
    val username: String,
    val global_name: String?,
    val avatar: String?
)
