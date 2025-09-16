package net.cakeyfox.serializable.data.website

import kotlinx.serialization.Serializable

@Serializable
data class UserSession(
    val tokenType: String,
    val accessToken: String,
    val avatar: String,
    val globalName: String?,
    val username: String,
    val userId: String
)
