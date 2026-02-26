package net.cakeyfox.serializable.data.utils

import kotlinx.serialization.Serializable

@Serializable
data class FoxyConfig(
    val environment: String,
    val discord: DiscordSettings,
    val website: Website,
    val database: Database,
    val showtime: Showtime,
    val youtube: YouTubeSettings,
    val turnstile: Turnstile,
    val foxpayments: FoxPayments,
    val topgg: TopggSettings,
    val lavalink: LavalinkSettings,
    val lastFm: LastFmSettings,
    val internalApi: InternalAPI,
    val leaderboard: Leaderboard
) {
    @Serializable
    data class LibreTranslateConfig(
        val url: String,
        val key: String,
    )

    @Serializable
    data class LavalinkSettings(
        val nodes: List<Node>
    ) {
        @Serializable
        data class Node(
            val name: String,
            val host: String,
            val port: Int,
            val password: String,
            val region: String?
        )
    }

    @Serializable
    data class LastFmSettings(
        val authorization: String
    )

    @Serializable
    data class Leaderboard(
        val limit: Int
    )

    @Serializable
    data class InternalAPI(
        val key: String,
        val port: Int,
        val hmacSecret: String,
    )

    @Serializable
    data class TopggSettings(
        val authorization: String,
    )

    @Serializable
    data class FoxPayments(
        val url: String,
        val key: String,
    )

    @Serializable
    data class Turnstile(
        val siteKey: String,
        val siteSecret: String
    )

    @Serializable
    data class YouTubeSettings(
        val key: String,
        val webhookUrl: String,
        val webhookSecret: String
    )

    @Serializable
    data class Showtime(
        val url: String,
        val key: String
    )

    @Serializable
    data class Database(
        val protocol: String,
        val address: String,
        val databaseName: String,
        val user: String,
        val password: String,
        val requestTimeout: Long,
    )

    @Serializable
    data class Website(
        val url: String,
        val port: Int,
        val sessionToken: String,
        val sessionName: String,
        val sessionDomain: String,
    )

    @Serializable
    data class DiscordSettings(
        val ownerId: Long,
        val guildId: Long,
        val applicationId: Long,
        val clientSecret: String,
        val token: String,
        val totalShards: Int,
        val getClusterIdFromHostname: Boolean,
        val baseUrl: String?,
        val clusterReadTimeout: Long,
        val clusterConnectionTimeout: Long,
        val replicaId: Int,
        val clusters: List<Cluster>
    ) {
        @Serializable
        data class Cluster(
            val id: Int,
            val name: String,
            val minShard: Int,
            val maxShard: Int,
            val isMasterCluster: Boolean,
            val clusterUrl: String
        )
    }
}