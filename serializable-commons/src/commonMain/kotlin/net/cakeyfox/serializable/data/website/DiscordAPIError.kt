package net.cakeyfox.serializable.data.website

import kotlinx.serialization.Serializable

@Serializable
data class DiscordAPIError(
    val code: Int,
    val message: String,
)
