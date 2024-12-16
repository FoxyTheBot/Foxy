package net.cakeyfox.foxy.utils.database

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import kotlinx.datetime.Clock
import kotlinx.datetime.toJavaInstant
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.data.*
import org.bson.Document

class MongoDBClient(private val instance: FoxyInstance) {

    private var mongoClient: MongoClient? = null
    private var database: MongoDatabase? = null
    private var json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    init {
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


    private fun createUser(userId: String): FoxyUser {
        val collection: MongoCollection<Document> = database!!.getCollection("users")

        val newUser = FoxyUser(
            _id = userId,
            userCreationTimestamp = Clock.System.now(),
            isBanned = false,
            banDate = null,
            banReason = "",
            userCakes = UserCakes(balance = 0, lastDaily = null),
            marryStatus = MarryStatus(
                marriedWith = null,
                marriedDate = null,
                cantMarry = false
            ),
            userProfile = UserProfile(
                decoration = "",
                decorationList = emptyList(),
                background = "default",
                backgroundList = listOf("default"),
                repCount = 0,
                lastRep = null,
                layout = "default",
                layoutList = listOf("default"),
                aboutme = ""
            ),
            userPremium = UserPremium(
                premium = false,
                premiumDate = null,
                premiumType = ""
            ),
            userSettings = UserSettings(language = "pt-br"),
            petInfo = PetInfo(
                name = "",
                type = "",
                rarity = "",
                level = 0,
                hungry = 100,
                happy = 100,
                health = 100,
                lastHungry = null,
                lastHappy = null,
                isDead = false,
                isClean = true,
                food = emptyList()
            ),
            userTransactions = emptyList(),
            premiumKeys = emptyList(),
            roulette = Roulette(availableSpins = 5),
            lastVote = null,
            notifiedForVote = false,
            voteCount = 0
        )

        val documentToJSON = json.encodeToString(newUser)
        val document = Document.parse(documentToJSON)
        document["userCreationTimestamp"] = java.util.Date.from(newUser.userCreationTimestamp.toJavaInstant())

        collection.insertOne(document)

        return newUser
    }
}