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

class MongoDBClient(foxy: FoxyInstance) {
    companion object {
        private var logger = KotlinLogging.logger(this::class.jvmName)
    }

    var users: MongoCollection<Document>
    var guilds: MongoCollection<Document>
    var mongoClient: MongoClient
    var database: MongoDatabase

    val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    val utils = DatabaseUtils(this)

    init {
        mongoClient = MongoClients.create(foxy.config.mongoUri)
        database = mongoClient.getDatabase(foxy.config.dbName)
        users = database.getCollection("users")
        guilds = database.getCollection("guilds")
        logger.info { "Connected to ${foxy.config.dbName} database" }
    }
}