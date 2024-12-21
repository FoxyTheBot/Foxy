package net.cakeyfox.serializable.database.data

import kotlinx.serialization.Serializable

@Serializable
data class Background(
    val id: String,
    val name: String,
    val cakes: Int? = 0,
    val filename: String,
    val description: String? = null,
    val author: String? = null,
    val inactive: Boolean = false
)