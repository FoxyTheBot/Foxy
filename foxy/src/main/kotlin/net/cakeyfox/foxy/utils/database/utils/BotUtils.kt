package net.cakeyfox.foxy.utils.database.utils

import com.mongodb.kotlin.client.coroutine.MongoCollection
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.serialization.Serializable
import mu.KotlinLogging
import net.cakeyfox.foxy.utils.database.DatabaseClient
import org.bson.Document

class BotUtils(
    val client: DatabaseClient
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
                    avatarUrl = null,
                    exchangeSettings = BotSettings.ExchangeSettings(
                        transactionFee = 0,
                        isExchangeEnabled = true,
                        foxyToLorittaExchange = BotSettings.ExchangeSettings.FoxyLorittaExchange(
                            exchangeRate = 0,
                            minimumAmount = 0,
                            isExchangeEnabled = true
                        ),
                        lorittaToFoxyExchange = BotSettings.ExchangeSettings.FoxyLorittaExchange(
                            exchangeRate = 0,
                            minimumAmount = 0,
                            isExchangeEnabled = true
                        )
                    )
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
        val avatarUrl: String?,
        val exchangeSettings: ExchangeSettings
    ) {
        @Serializable
        data class ExchangeSettings(
            val transactionFee: Long,
            val isExchangeEnabled: Boolean,
            val foxyToLorittaExchange: FoxyLorittaExchange,
            val lorittaToFoxyExchange: FoxyLorittaExchange
        ) {
            @Serializable
            data class FoxyLorittaExchange(
                val exchangeRate: Long,
                val minimumAmount: Long,
                val isExchangeEnabled: Boolean
            )
        }
    }

    private suspend fun createBotSettings(botSettingsCollection: MongoCollection<Document>) {
        val botSettings = BotSettings(
            activity = "foxybot.win · /help",
            status = "online",
            avatarUrl = null,
            exchangeSettings = BotSettings.ExchangeSettings(
                transactionFee = 0,
                isExchangeEnabled = true,
                foxyToLorittaExchange = BotSettings.ExchangeSettings.FoxyLorittaExchange(
                    exchangeRate = 0,
                    minimumAmount = 0,
                    isExchangeEnabled = true
                ),
                lorittaToFoxyExchange = BotSettings.ExchangeSettings.FoxyLorittaExchange(
                    exchangeRate = 0,
                    minimumAmount = 0,
                    isExchangeEnabled = true
                )
            )
        )

        logger.info { "Creating new bot settings document" }

        val documentToJSON = client.json.encodeToString(botSettings)
        val document = Document.parse(documentToJSON)

        botSettingsCollection.insertOne(document)
    }
}