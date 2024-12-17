package net.cakeyfox.serializable.database.data

import kotlinx.serialization.Serializable

@Serializable
data class Background(
    val id: String,
    val name: String,
    val cakes: Int,
    val filename: String,
    val description: String,
    val author: String,
    val inactive: Boolean = false
)