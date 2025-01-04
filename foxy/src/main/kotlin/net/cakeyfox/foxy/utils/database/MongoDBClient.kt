package net.cakeyfox.foxy.utils.database

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.utils.database.utils.DatabaseUtils
import net.cakeyfox.foxy.FoxyInstance
import org.bson.Document
import kotlin.reflect.jvm.jvmName

class MongoDBClient() {
    companion object {
        private var logger = KotlinLogging.logger(this::class.jvmName)
    }

    private lateinit var mongoClient: MongoClient
    private lateinit var guilds: MongoCollection<Document>
    lateinit var users: MongoCollection<Document>
    lateinit var database: MongoDatabase

    val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    val utils = DatabaseUtils(this)

    fun start(foxy: FoxyInstance) {
        mongoClient = MongoClients.create(foxy.config.mongoUri)
        database = mongoClient.getDatabase(foxy.config.dbName)
        users = database.getCollection("users")
        guilds = database.getCollection("guilds")
        logger.info { "Connected to ${foxy.config.dbName} database" }
    }

    fun close() {
        mongoClient.close()
        logger.info { "Disconnected from MongoDB" }
    }
}