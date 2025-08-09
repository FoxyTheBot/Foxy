package net.cakeyfox.serializable.data.cluster

import kotlinx.serialization.Serializable

@Serializable
data class ClusterInfo(
    val id: Int,
    val name: String,
    val shardCount: Int,
    val guildCount: Int,
    val ping: Double,
    val minShard: Int,
    val maxShard: Int,
)