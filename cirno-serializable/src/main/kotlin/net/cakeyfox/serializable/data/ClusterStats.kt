package net.cakeyfox.serializable.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ClusterStats(
    val serverCount: Int
) {
    @Serializable
    data class TopggBotStats(
        @SerialName("server_count")
        val serverCount: Int
    )
}