package net.cakeyfox.foxy.utils.database

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.database.utils.*
import org.bson.Document
import kotlin.reflect.jvm.jvmName

class MongoDBClient(foxy: FoxyInstance) {
    var users: MongoCollection<Document>
    private val guilds: MongoCollection<Document>

    private var logger = KotlinLogging.logger(this::class.jvmName)
    private var mongoClient: MongoClient? = null
    var database: MongoDatabase? = null
    var json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }
    val utils = DatabaseUtils(this)

    init {
        mongoClient = MongoClients.create(foxy.config.get("mongo_uri"))
        database = mongoClient?.getDatabase(foxy.config.get("db_name"))
        users = database!!.getCollection("users")
        guilds = database!!.getCollection("guilds")
        logger.info { "Connected to ${foxy.config.get("db_name")} database" }
    }
}