package net.cakeyfox.serializable.database.data

import kotlinx.serialization.Serializable

@Serializable
data class Badge(
    val id: String,
    val name: String,
    val asset: String,
    val description: String,
    val exclusive: Boolean = false,
    val priority: Int = 0,
    val isFromGuild: String? = null,
)