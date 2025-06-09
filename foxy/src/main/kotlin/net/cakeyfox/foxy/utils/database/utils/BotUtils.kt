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
        // TODO: Move this data class to DatabaseUtils library
        // https://github.com/FoxyTheBot/DatabaseUtils

        @Serializable
        data class Command(
            val uniqueId: String,
            val name: String,
            val usageCount: Long = 0,
            val description: String,
            val subCommands: List<SubCommand>,
            val usage: String? = null,
            val category: String? = "utils",
            val supportsLegacy: Boolean? = false
        ) {
            @Serializable
            data class SubCommand(
                val uniqueId: String,
                val name: String,
                val description: String,
                val usage: String? = null,
                val supportsLegacy: Boolean? = false
            )
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

        private val logger = KotlinLogging.logger { }
    }

    suspend fun getOrRegisterCommand(command: Command): Command {
        val allCommands = client.database.getCollection<Document>("commands")
        val commandQuery = Document("name", command.name)
        val existingDocument = allCommands.find(commandQuery).firstOrNull()

        if (existingDocument == null) {
            val documentToJSON = client.foxy.json.encodeToString(command)
            val document = Document.parse(documentToJSON)

            allCommands.insertOne(document)

            return command
        }

        val documentToJSON = existingDocument.toJson()
        return client.foxy.json.decodeFromString<Command>(documentToJSON)
    }

    suspend fun updateCommandUsage(commandName: String): Boolean? {
        val allCommands = client.database.getCollection<Document>("commands")
        val commandQuery = Document("name", commandName)
        val existingDocument = allCommands.find(commandQuery).firstOrNull()
        val update = Document("\$inc", Document("usageCount", 1))

        if (existingDocument == null) return null
        allCommands.updateOne(commandQuery, update)

        return true
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
        return client.foxy.json.decodeFromString(documentToJSON)
    }

    suspend fun getActivity(): String {
        val botSettings = client.database.getCollection<Document>("botSettings")
        val botSettingsDocument = botSettings.find().firstOrNull()
            ?: run {
                createBotSettings(botSettings)
                return "foxybot.win · /help"
            }

        val documentToJSON = botSettingsDocument.toJson()
        val botSettingsData = client.foxy.json.decodeFromString<BotSettings>(documentToJSON)

        return botSettingsData.activity
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

        logger.info { "Generating Foxy settings..." }

        val documentToJSON = client.foxy.json.encodeToString(botSettings)
        val document = Document.parse(documentToJSON)

        botSettingsCollection.insertOne(document)
    }
}