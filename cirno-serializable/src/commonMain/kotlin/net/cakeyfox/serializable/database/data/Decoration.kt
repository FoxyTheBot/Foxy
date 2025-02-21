package net.cakeyfox.serializable.database.data

import kotlinx.serialization.Serializable

@Serializable
data class Decoration(
    val id: String,
    val name: String,
    val cakes: Int,
    val filename: String,
    val description: String? = null,
    val inactive: Boolean = false,
    val author: String? = null,
    val isMask: Boolean = false,
)