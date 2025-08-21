package net.cakeyfox.serializable.data.cluster

import kotlinx.serialization.Serializable

@Serializable
data class CustomMemberResponse(
    val isMember: Boolean
)
