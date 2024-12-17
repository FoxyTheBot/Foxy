package net.cakeyfox.foxy.utils.database

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.database.utils.ProfileUtils
import net.cakeyfox.foxy.utils.database.utils.UserUtils
import org.bson.Document
import kotlin.reflect.jvm.jvmName

class MongoDBClient(instance: FoxyInstance) {
    // TODO: Create all methods to interact with the Foxy database

    var users: MongoCollection<Document>
    private var logger = KotlinLogging.logger(this::class.jvmName)
    private var mongoClient: MongoClient? = null
    var database: MongoDatabase? = null
    var json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }
    val profileUtils = ProfileUtils(instance)
    val userUtils = UserUtils(instance)

    init {
        mongoClient = MongoClients.create(instance.config.get("mongo_uri"))
        database = mongoClient?.getDatabase(instance.config.get("db_name"))
        users = database!!.getCollection("users")
        logger.info { "Connected to ${instance.config.get("db_name")} database" }
    }
}