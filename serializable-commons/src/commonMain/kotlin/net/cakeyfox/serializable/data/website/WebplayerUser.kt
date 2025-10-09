package net.cakeyfox.serializable.data.website

import kotlinx.serialization.Serializable

@Serializable
data class WebplayerUser(
    val userId: String,
    val signature: String
)
