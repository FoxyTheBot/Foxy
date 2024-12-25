package net.cakeyfox.foxy.utils.config

import kotlinx.serialization.Serializable

@Serializable
data class FoxyConfig(
    val ownerId: String,
    val guildId: String,
    val environment: String,
    val discordToken: String,
    val mongoUri: String,
    val dbName: String,
    val mongoTimeout: Long,
    val foxyApiKey: String,
    val dblToken: String,
    val artistryKey: String,
    val activityPort: Int
)
