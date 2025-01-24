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

class UserUtils(
    private val client: MongoDBClient
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

    suspend fun getAllUsers(): List<FoxyUser> {
        return withContext(Dispatchers.IO) {
            val collection = client.database.getCollection<Document>("users")

            val users = mutableListOf<FoxyUser>()

            collection.find().collect {
                val documentToJSON = it.toJson()
                users.add(client.json.decodeFromString(documentToJSON))
            }

            return@withContext users
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