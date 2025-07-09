package net.cakeyfox.serializable.data

import kotlinx.serialization.Serializable

@Serializable
data class CustomMemberResponse(
    val isMember: Boolean
)
