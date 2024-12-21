package net.cakeyfox.serializable.data

import kotlinx.serialization.Serializable

@Serializable
data class ActionResponse(
    val url: String
)