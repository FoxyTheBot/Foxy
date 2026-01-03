package net.cakeyfox.serializable.data.cluster

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable

@Serializable
data class UnbanRouteRequest(
    val reason: String,
    val users: List<String>,
    val duration: Instant
)
