package net.cakeyfox.foxy.utils.database.utils

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import kotlinx.serialization.json.Json
import net.cakeyfox.foxy.utils.database.DatabaseClient
import net.cakeyfox.serializable.database.data.*
import org.bson.Document
import kotlin.reflect.KClass
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import com.mongodb.client.model.Filters.eq
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.jvmName

class GuildUtils(
    private val client: DatabaseClient
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)

    val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    suspend fun getGuild(guildId: String): Guild {
        return updateGuildWithNewFields(guildId)
    }

    suspend fun deleteGuild(guildId: String) {
        withContext(Dispatchers.IO) {
            val guilds = client.database.getCollection<Document>("guilds")
            guilds.deleteOne(eq("_id", guildId))
        }
    }

    private suspend fun createGuild(guildId: String): Guild {
        val guilds = client.database.getCollection<Document>("guilds")

        val newGuild = Guild(
            _id = guildId,
            guildAddedAt = System.currentTimeMillis(),
            GuildJoinLeaveModule = WelcomerModule(),
            antiRaidModule = AntiRaidModule(),
            AutoRoleModule = AutoRoleModule(),
            guildSettings = GuildSettings(),
        )

        val documentToJSON = client.json.encodeToString(newGuild)
        val document = Document.parse(documentToJSON)
        guilds.insertOne(document)

        return newGuild
    }

    // Adding missing fields if necessary

    private suspend fun updateGuildWithNewFields(guildId: String): Guild {
        return withContext(Dispatchers.IO) {
            val guilds = client.database.getCollection<Document>("guilds")

            val existingDocument =
                guilds.find(eq("_id", guildId))
                    .firstOrNull() ?: return@withContext createGuild(guildId)

            val documentToJSON = existingDocument.toJson()

            val objectMapper = ObjectMapper()
            objectMapper.enable(DeserializationFeature.USE_LONG_FOR_INTS)
            val jsonNode = objectMapper.readTree(documentToJSON)

            val updatedJsonNode = ensureFields(Guild::class, jsonNode, guildId)

            val updatedGuild = client.json.decodeFromString<Guild>(updatedJsonNode.toString())

            val updatedDocument = Document.parse(client.json.encodeToString(updatedGuild))
            val update = Document("\$set", updatedDocument)
            guilds.updateOne(eq("_id", guildId), update)

            updatedGuild
        }
    }

    // Check missing fields and add them

    private fun ensureFields(dataClass: KClass<*>, jsonNode: JsonNode, guildId: String): JsonNode {
        val updatedJsonNode = (jsonNode as ObjectNode)

        dataClass.memberProperties.forEach { property ->
            val fieldName = property.name

            if (!updatedJsonNode.has(fieldName)) {
                logger.info { "Missing field $fieldName on guild $guildId, adding it." }
                val defaultValue = getDefaultValue(property.returnType.classifier as KClass<*>)
                updatedJsonNode.putPOJO(fieldName, defaultValue)
            }

            if (updatedJsonNode.has(fieldName) && updatedJsonNode.get(fieldName).isNull) {
                logger.info { "Field $fieldName doesn't have a value, adding a value." }
                val defaultValue = getDefaultValue(property.returnType.classifier as KClass<*>)
                updatedJsonNode.putPOJO(fieldName, defaultValue)
            }
        }

        return updatedJsonNode
    }

    private fun getDefaultValue(type: KClass<*>): Any? {
        return when (type) {
            String::class -> "owo what's this?"
            Int::class -> 0
            Boolean::class -> false
            Double::class -> 0.0
            Long::class -> 0L
            List::class -> emptyList<Any>()
            AntiRaidModule::class -> AntiRaidModule()
            AutoRoleModule::class -> AutoRoleModule()
            WelcomerModule::class -> WelcomerModule()
            GuildSettings::class -> GuildSettings()
            else -> null
        }
    }
}