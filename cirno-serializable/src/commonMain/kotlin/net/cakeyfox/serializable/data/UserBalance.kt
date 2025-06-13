package net.cakeyfox.serializable.data

import kotlinx.serialization.Serializable

@Serializable
data class UserBalance(
    val userId: String,
    val balance: Long
)