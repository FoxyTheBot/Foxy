package net.cakeyfox.serializable.database.data

import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable
import net.cakeyfox.serializable.database.utils.MongoDateSerializer

@Serializable
data class FoxyUser(
    val _id: String,
    @Serializable(with = MongoDateSerializer::class)
    val userCreationTimestamp: Instant = Clock.System.now(),
    val isBanned: Boolean? = false,
    @Serializable(with = MongoDateSerializer::class)
    val banDate: Instant? = null,
    val banReason: String? = null,
    val userCakes: UserCakes,
    val marryStatus: MarryStatus,
    val userProfile: UserProfile,
    val userPremium: UserPremium,
    val userSettings: UserSettings,
    val petInfo: PetInfo? = null,
    val lastRob: Long? = 0,
    val userTransactions: List<Transaction>? = emptyList(),
    val premiumKeys: List<Key>? = emptyList(),
    val roulette: Roulette? = null,
    @Serializable(with = MongoDateSerializer::class)
    val lastVote: Instant? = null,
    val notifiedForVote: Boolean? = false,
    val voteCount: Int? = null
)

@Serializable
data class UserCakes(
    val balance: Double = 0.0,
    @Serializable(with = MongoDateSerializer::class)
    val lastDaily: Instant? = null
)

@Serializable
data class MarryStatus(
    val marriedWith: String? = null,
    @Serializable(with = MongoDateSerializer::class)
    val marriedDate: Instant? = null,
    val cantMarry: Boolean = false
)

@Serializable
data class UserProfile(
    val decoration: String? = null,
    val decorationList: List<String> = emptyList(),
    val background: String = "default",
    val backgroundList: List<String> = listOf("default"),
    val repCount: Int = 0,
    @Serializable(with = MongoDateSerializer::class)
    val lastRep: Instant? = null,
    val layout: String = "default",
    val layoutList: List<String> = listOf("default"),
    val aboutme: String? = null
)

@Serializable
data class UserPremium(
    val premium: Boolean = false,
    @Serializable(with = MongoDateSerializer::class)
    val premiumDate: Instant? = null,
    val premiumType: String? = null
)

@Serializable
data class UserSettings(
    val language: String = "pt-BR"
)

@Serializable
data class PetInfo(
    val name: String? = null,
    val type: String? = null,
    val rarity: String? = null,
    val level: Int = 0,
    val hungry: Int = 100,
    val happy: Int = 100,
    val health: Int = 100,
    @Serializable(with = MongoDateSerializer::class)
    val lastHungry: Instant? = null,
    @Serializable(with = MongoDateSerializer::class)
    val lastHappy: Instant? = null,
    val isDead: Boolean = false,
    val isClean: Boolean = true,
    val food: List<String> = emptyList()
)

@Serializable
data class Transaction(
    val to: String? = null,
    val from: String? = null,
    val quantity: Double = 0.0,
    @Serializable(with = MongoDateSerializer::class)
    val date: Instant? = null,
    val received: Boolean = false,
    val type: String? = null
)


@Serializable
data class Key(
    val key: String,
    val used: Boolean,
    @Serializable(with = MongoDateSerializer::class)
    val expiresAt: Instant,
    val pType: Int? = null
)

@Serializable
data class Roulette(
    val availableSpins: Int = 5
)