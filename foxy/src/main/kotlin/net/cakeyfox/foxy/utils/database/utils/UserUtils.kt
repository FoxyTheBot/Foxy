package net.cakeyfox.foxy.utils.database.utils

import kotlinx.datetime.toJavaInstant
import net.cakeyfox.foxy.utils.database.DatabaseClient
import org.bson.Document
import kotlinx.coroutines.flow.firstOrNull
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Indexes.descending
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.database.data.*

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

    suspend fun updateUsers(users: List<FoxyUser>, updates: Map<String, Any?>) {
        client.withRetry {
            val query = Document("_id", Document("\$in", users.map { it._id }))
            val update = Document("\$set", Document(updates))

            client.users.updateMany(query, update)
        }
    }

    suspend fun getTopUsersByCakes(): List<FoxyUser> {
        return client.withRetry {
            val collection = client.database.getCollection<Document>("users")
            collection.find()
                .sort(descending("userCakes.balance"))
                .limit(foxy.config.others.leaderboardLimit)
                .map { document ->
                    val documentToJSON = document.toJson()
                    client.foxy.json.decodeFromString<FoxyUser>(documentToJSON)
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
                userPremium = UserPremium(),
                userSettings = UserSettings(language = "pt-br"),
                petInfo = PetInfo(),
                userTransactions = emptyList(),
                premiumKeys = emptyList(),
                roulette = Roulette(),
            )

            val documentToJSON = client.foxy.json.encodeToString(newUser)
            val document = Document.parse(documentToJSON)
            document["userCreationTimestamp"] = java.util.Date.from(newUser.userCreationTimestamp.toJavaInstant())

            collection.insertOne(document)

            newUser
        }
    }
}