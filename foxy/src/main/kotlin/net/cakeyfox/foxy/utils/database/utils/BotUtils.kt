package net.cakeyfox.foxy.utils.database.utils

import com.mongodb.kotlin.client.coroutine.MongoCollection
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import mu.KotlinLogging
import net.cakeyfox.foxy.utils.database.MongoDBClient
import org.bson.Document

class BotUtils(
    val client: MongoDBClient
) {
    companion object {
        private val logger = KotlinLogging.logger {  }
    }

    suspend fun getBotSettings(): BotSettings {
        val botSettings = client.database.getCollection<Document>("botSettings")
        val botSettingsDocument = botSettings.find().firstOrNull()
            ?: run {
                createBotSettings(botSettings)
                return BotSettings(
                    activity = "foxybot.win · /help",
                    status = "online",
                    avatarUrl = null
                )
            }

        val documentToJSON = botSettingsDocument.toJson()
        return client.json.decodeFromString(documentToJSON)
    }

    suspend fun getActivity(): String {
        val botSettings = client.database.getCollection<Document>("botSettings")
        val botSettingsDocument = botSettings.find().firstOrNull()
            ?: run {
                createBotSettings(botSettings)
                return "foxybot.win · /help"
            }

        val documentToJSON = botSettingsDocument.toJson()
        val botSettingsData = client.json.decodeFromString<BotSettings>(documentToJSON)

        return botSettingsData.activity
    }

    @Serializable
    data class BotSettings(
        val activity: String,
        val status: String,
        val avatarUrl: String?
    )

    private suspend fun createBotSettings(botSettingsCollection: MongoCollection<Document>) {
        val botSettings = BotSettings(
            activity = "foxybot.win · /help",
            status = "online",
            avatarUrl = null
        )

        logger.info { "Creating new bot settings document" }

        val documentToJSON = client.json.encodeToString(botSettings)
        val document = Document.parse(documentToJSON)

        botSettingsCollection.insertOne(document)
    }
}