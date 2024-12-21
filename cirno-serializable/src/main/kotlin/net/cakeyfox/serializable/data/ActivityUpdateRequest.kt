package net.cakeyfox.serializable.data

import kotlinx.serialization.Serializable

@Serializable
data class ActivityUpdateRequest(
    val name: String,
    val type: Int,
    val url: String? = null,
    val status: String? = "online",
)
