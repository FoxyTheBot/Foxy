package net.cakeyfox.foxy.utils.database.utils

import kotlinx.datetime.toJavaInstant
import kotlinx.serialization.encodeToString
import net.cakeyfox.foxy.utils.database.MongoDBClient
import net.cakeyfox.serializable.database.data.*
import org.bson.Document
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Indexes.descending
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import net.cakeyfox.foxy.FoxyInstance

class UserUtils(
    private val client: MongoDBClient,
    private val foxy: FoxyInstance
) {

    suspend fun getDiscordUser(userId: String): FoxyUser {
        return withContext(Dispatchers.IO) {
            val collection = client.database.getCollection<Document>("users")

            val existingUserDocument = collection.find(eq("_id", userId)).firstOrNull()
                ?: return@withContext createUser(userId)

            val documentToJSON = existingUserDocument.toJson()

            return@withContext client.json.decodeFromString<FoxyUser>(documentToJSON)
        }
    }

    suspend fun updateUser(userId: String, updates: Map<String, Any?>) {
        withContext(Dispatchers.IO) {
            val query = Document("_id", userId)
            val update = Document("\$set", Document(updates))

            client.users.updateOne(query, update)
        }
    }

    suspend fun updateUsers(users: List<FoxyUser>, updates: Map<String, Any?>) {
        withContext(Dispatchers.IO) {
            val query = Document("_id", Document("\$in", users.map { it._id }))
            val update = Document("\$set", Document(updates))

            client.users.updateMany(query, update)
        }
    }

    suspend fun getTopUsersByCakes(): List<FoxyUser> {
        return withContext(Dispatchers.IO) {
            val collection = client.database.getCollection<Document>("users")
            collection.find()
                .sort(descending("userCakes.balance"))
                .limit(foxy.config.others.leaderboardLimit)
                .map { document ->
                    val documentToJSON = document.toJson()
                    client.json.decodeFromString<FoxyUser>(documentToJSON)
                }
                .toList()
        }
    }

    private suspend fun createUser(userId: String): FoxyUser {
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

        val documentToJSON = client.json.encodeToString(newUser)
        val document = Document.parse(documentToJSON)
        document["userCreationTimestamp"] = java.util.Date.from(newUser.userCreationTimestamp.toJavaInstant())

        collection.insertOne(document)

        return newUser
    }
}