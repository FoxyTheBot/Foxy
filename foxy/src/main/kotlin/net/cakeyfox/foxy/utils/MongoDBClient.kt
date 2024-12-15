package net.cakeyfox.foxy.utils

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import kotlinx.datetime.Clock
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.data.*
import org.bson.Document

class MongoDBClient(val instance: FoxyInstance) {

    private var mongoClient: MongoClient? = null
    private var database: MongoDatabase? = null
    private var json = Json { ignoreUnknownKeys = true }

    fun init() {
        mongoClient = MongoClients.create(instance.config.get("mongo_uri"))
        database = mongoClient?.getDatabase(instance.config.get("db_name"))
    }

    fun getDiscordUser(userId: String): FoxyUser {
        val collection: MongoCollection<Document> = database!!.getCollection("users")

        val query = Document("_id", userId)
        val existingUserDocument = collection.find(query).firstOrNull()
            ?: return createUser(userId)

        val documentToJSON = existingUserDocument.toJson()

        return json.decodeFromString<FoxyUser>(documentToJSON)
    }


    fun createUser(userId: String): FoxyUser {
        val collection: MongoCollection<Document> = database!!.getCollection("users")

        val newUser = FoxyUser(
            _id = userId,
            userCreationTimestamp = Clock.System.now(),
            isBanned = false,
            banDate = null,
            banReason = "",
            userCakes = UserCakes(0, null),
            marryStatus = MarryStatus(
                "",
                null,
                false
            ),
            userProfile = UserProfile("", listOf(), "", listOf(), 0, null, "", listOf(), ""),
            userPremium = UserPremium(false, null, ""),
            userSettings = UserSettings(""),
            petInfo = PetInfo("", "", "", 0, 0, 0, 0, null, null, false, false, listOf()),
            userTransactions = listOf(),
            premiumKeys = listOf(),
            roulette = Roulette(5),
            lastVote = null,
            notifiedForVote = false,
            voteCount = 0
        )

        val documentToJSON = json.encodeToString(newUser)
        val document = Document.parse(documentToJSON)
        collection.insertOne(document)

        return newUser
    }
}