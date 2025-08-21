package net.cakeyfox.serializable.data.cluster

import kotlinx.serialization.Serializable

@Serializable
data class ActivityUpdateRequest(
    val name: String = "uwu",
    val type: Int = 0,
    val url: String? = null,
    val status: String = "online",
)
