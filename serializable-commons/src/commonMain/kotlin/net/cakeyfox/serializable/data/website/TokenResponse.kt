package net.cakeyfox.serializable.data.website

import kotlinx.serialization.Serializable

@Serializable
data class TokenResponse(
    val token_type: String,
    val access_token: String,
)
