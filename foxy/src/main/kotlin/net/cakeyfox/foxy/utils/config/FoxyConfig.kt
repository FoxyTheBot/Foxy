package net.cakeyfox.foxy.utils.config

import kotlinx.serialization.Serializable

@Serializable
data class FoxyConfig(
    val environment: String,
    val discord: DiscordSettings,
    val database: DatabaseSettings,
    val others: OtherSettings
) {
    @Serializable
    data class DiscordSettings(
        val ownerId: String,
        val guildId: String,
        val applicationId: String,
        val token: String,
        val totalShards: Int,
        val clusters: List<Cluster>
    )

    @Serializable
    data class Cluster(
        val id: String,
        val name: String,
        val minShard: Int,
        val maxShard: Int,
        val canPublishStats: Boolean,
        val clusterUrl: String,
    )

    @Serializable
    data class DatabaseSettings(
        val uri: String,
        val databaseName: String,
        val requestTimeout: Int
    )

    @Serializable
    data class OtherSettings(
        val foxyApi: FoxyAPISettings,
        val internalApi: InternalApi,
        val artistry: ArtistrySettings,
        val activityUpdater: ActivityUpdaterSettings,
        val statsSenderPort: Int,
        val topggToken: String,
    ) {
        @Serializable
        data class InternalApi(
            val key: String
        )

        @Serializable
        data class FoxyAPISettings(
            val key: String
        )

        @Serializable
        data class ArtistrySettings(
            val key: String
        )

        @Serializable
        data class ActivityUpdaterSettings(
            val port: Int
        )
    }
}