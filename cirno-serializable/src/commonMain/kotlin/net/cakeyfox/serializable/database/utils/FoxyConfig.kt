package net.cakeyfox.serializable.database.utils

import kotlinx.serialization.Serializable

@Serializable
data class FoxyConfig(
    val environment: String,
    val discord: DiscordSettings,
    val database: DatabaseSettings,
    val topgg: Topgg,
    val others: OtherSettings
) {
    @Serializable
    data class DiscordSettings(
        val ownerId: String,
        val guildId: String,
        val applicationId: String,
        val token: String,
        val totalShards: Int,
        val getClusterIdFromHostname: Boolean,
        val replicaId: Int,
        val clusters: List<Cluster>
    )

    @Serializable
    data class Cluster(
        val id: Int,
        val name: String,
        val minShard: Int,
        val maxShard: Int,
        val isMasterCluster: Boolean,
        val clusterUrl: String,
    )

    @Serializable
    data class DatabaseSettings(
        val uri: String,
        val databaseName: String,
        val requestTimeout: Int
    )

    @Serializable
    data class Topgg(
        val authorization: String
    )

    @Serializable
    data class OtherSettings(
        val foxyApi: FoxyAPISettings,
        val internalApi: InternalApi,
        val leaderboardLimit: Int,
        val artistry: ArtistrySettings,
        val topggToken: String,
    ) {
        @Serializable
        data class InternalApi(
            val key: String,
            val port: Int
        )

        @Serializable
        data class FoxyAPISettings(
            val key: String
        )

        @Serializable
        data class ArtistrySettings(
            val url: String,
            val key: String
        )
    }
}