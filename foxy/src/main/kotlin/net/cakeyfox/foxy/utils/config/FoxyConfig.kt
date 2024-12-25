package net.cakeyfox.foxy.utils.config

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.io.IOException
import java.util.Properties

@Serializable
data class FoxyConfig(
    val ownerId: String = "687867247116812378",
    val guildId: String = "768267522670723094",
    val environment: String = "development",
    val discordToken: String = "<KEY>",
    val mongoUri: String = "mongodb://localhost:27017",
    val dbName: String = "foxy",
    val mongoTimeout: Long = 10000,
    val foxyApiKey: String = "<KEY>",
    val dblToken: String = "<KEY>",
    val artistryUrl: String = "https://artistry.foxybot.win",
    val artistryKey: String = "<KEY>",
    val activityPort: Int = 8080
)
