package net.cakeyfox.foxy.utils.config

import kotlinx.serialization.Serializable

@Serializable
data class FoxyConfig(
    val applicationId: String,
    val ownerId: String,
    val guildId: String,
    val environment: String,
    val discordToken: String,
    val minShards: Int,
    val maxShards: Int,
    val totalShards: Int,
    val mongoUri: String,
    val dbName: String,
    val mongoTimeout: Long,
    val foxyApiKey: String,
    val dblToken: String,
    val artistryKey: String,
    val activityPort: Int
)
