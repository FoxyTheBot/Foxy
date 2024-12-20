package net.cakeyfox.serializable.database.data

import kotlinx.serialization.Serializable

@Serializable
data class ActionResponse(
    val url: String
)