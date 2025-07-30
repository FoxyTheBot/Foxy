package net.cakeyfox.foxy.utils.database.utils

import com.mongodb.client.model.Filters.and
import kotlinx.datetime.toJavaInstant
import net.cakeyfox.foxy.utils.database.DatabaseClient
import org.bson.Document
import kotlinx.coroutines.flow.firstOrNull
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Filters.exists
import com.mongodb.client.model.Filters.ne
import com.mongodb.client.model.Indexes.descending
import com.mongodb.client.model.Projections.include
import com.mongodb.client.model.Sorts.ascending
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.database.data.*
import net.cakeyfox.serializable.data.UserBalance
import java.time.Instant

class UserUtils(
    private val client: DatabaseClient,
    private val foxy: FoxyInstance
) {
    suspend fun getFoxyProfile(userId: String): FoxyUser {
        return client.withRetry {
            val collection = client.database.getCollection<Document>("users")

            val existingUserDocument = collection.find(eq("_id", userId)).firstOrNull()
                ?: return@withRetry createUser(userId)

            val documentToJSON = existingUserDocument.toJson()
            client.foxy.json.decodeFromString<FoxyUser>(documentToJSON)
        }
    }

    suspend fun updateUser(userId: String, updates: Map<String, Any?>) {
        client.withRetry {
            val query = Document("_id", userId)
            val update = Document("\$set", Document(updates))

            client.users.updateOne(query, update)
        }
    }

    suspend fun addVote(userId: String) {
        val userData = getFoxyProfile(userId)
        client.withRetry {
            val query = Document("_id", userId)
            val updates = mapOf<String, Any?>(
                "lastVote" to Instant.now(),
                "voteCount" to (userData.voteCount ?: 0) + 1,
                "notifiedForVote" to false,
                "userCakes.balance" to userData.userCakes.balance + 1500
            )

            val update = Document("\$set", Document(updates))
            client.users.updateOne(query, update)
        }
    }

    suspend fun updateUsers(users: List<FoxyUser>, updates: Map<String, Any?>) {
        client.withRetry {
            val query = Document("_id", Document("\$in", users.map { it._id }))
            val update = Document("\$set", Document(updates))

            client.users.updateMany(query, update)
        }
    }

    suspend fun getTopMarriedUsers(): List<FoxyUser> {
        return client.withRetry {
            val collection = client.database.getCollection<Document>("users")
            collection.find(
                and(
                    exists("marryStatus.marriedWith", true),
                    exists("marryStatus.marriedDate", true),
                    ne("marryStatus.marriedDate", null)
                )
            )
                .sort(ascending("marryStatus.marriedDate"))
                .limit(55)
                .map { document ->
                    val documentToJSON = document.toJson()
                    client.foxy.json.decodeFromString<FoxyUser>(documentToJSON)
                }
                .toList()
        }
    }

    suspend fun getTopUsersByCakes(): List<UserBalance> {
        return client.withRetry {
            val collection = client.database.getCollection<Document>("users")
            collection.find()
                .sort(descending("userCakes.balance"))
                .limit(foxy.config.others.leaderboardLimit)
                .projection(include("_id", "userCakes.balance"))
                .map { document ->
                    val id = document.getString("_id")
                    val balanceAny = document.getEmbedded(listOf("userCakes", "balance"), Any::class.java)
                    val balanceDouble = when (balanceAny) {
                        is Double -> balanceAny
                        is Int -> balanceAny.toDouble()
                        is Long -> balanceAny.toDouble()
                        else -> 0.0
                    }
                    val balance = balanceDouble.toLong()
                    UserBalance(userId = id, balance = balance)
                }
                .toList()
        }
    }

    suspend fun addCakesToUser(userId: String, amount: Long) {
        client.withRetry {
            val query = Document("_id", userId)
            val update = Document("\$inc", Document("userCakes.balance", amount.toDouble()))

            client.users.updateOne(query, update)
        }
    }

    suspend fun removeCakesFromUser(userId: String, amount: Long) {
        client.withRetry {
            val query = Document("_id", userId)
            val update = Document("\$inc", Document("userCakes.balance", -amount.toDouble()))

            client.users.updateOne(query, update)
        }
    }

    private suspend fun createUser(userId: String): FoxyUser {
        return client.withRetry {
            val collection = client.database.getCollection<Document>("users")

            val newUser = FoxyUser(
                _id = userId,
                userCakes = UserCakes(balance = 0.0),
                marryStatus = MarryStatus(),
                userProfile = UserProfile(),
                userBirthday = UserBirthday(),
                userPremium = UserPremium(),
                userSettings = UserSettings(language = "pt-br"),
                petInfo = PetInfo(),
                userTransactions = emptyList(),
                premiumKeys = emptyList(),
                roulette = Roulette(),
            )

            val documentToJSON = client.foxy.json.encodeToString(newUser)
            val document = Document.parse(documentToJSON)
            document["userCreationTimestamp"] = java.util.Date.from(newUser.userCreationTimestamp!!.toJavaInstant())

            collection.insertOne(document)

            newUser
        }
    }
}