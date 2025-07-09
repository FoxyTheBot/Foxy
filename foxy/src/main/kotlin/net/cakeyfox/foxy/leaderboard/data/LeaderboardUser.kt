package net.cakeyfox.foxy.leaderboard.data

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable
import net.cakeyfox.foxy.database.utils.MongoDateSerializer

sealed class LeaderboardUser {
    abstract val rank: Int
    abstract val username: String
    abstract val id: String
    abstract val avatar: String

    data class CakesUser(
        override val rank: Int,
        override val username: String,
        override val id: String,
        override val avatar: String,
        val cakes: String
    ) : LeaderboardUser()

    data class MarriageUser(
        override var rank: Int,
        override val username: String,
        override val id: String,
        override val avatar: String,
        val marriedWith: String,
        @Serializable(with = MongoDateSerializer::class)
        val marriedDate: Instant
    ) : LeaderboardUser()
}
