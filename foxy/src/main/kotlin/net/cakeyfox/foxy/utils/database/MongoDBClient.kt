package net.cakeyfox.foxy.utils.database

import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.utils.database.utils.DatabaseUtils
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.database.data.FoxyUser
import net.cakeyfox.serializable.database.data.Guild
import kotlin.reflect.jvm.jvmName

class MongoDBClient(
    foxy: FoxyInstance
) {
    companion object {
        private var logger = KotlinLogging.logger(this::class.jvmName)
    }

    private lateinit var mongoClient: MongoClient
    private lateinit var guilds: MongoCollection<Guild>
    lateinit var users: MongoCollection<FoxyUser>
    lateinit var database: MongoDatabase

    val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    val utils = DatabaseUtils(this, foxy)

    fun start(foxy: FoxyInstance) {
        mongoClient = MongoClient.create(foxy.config.database.uri)
        database = mongoClient.getDatabase(foxy.config.database.databaseName)
        users = database.getCollection("users")
        guilds = database.getCollection("guilds")
        logger.info { "Connected to ${foxy.config.database.databaseName} database" }
    }

    fun close() {
        mongoClient.close()
        logger.info { "Disconnected from MongoDB" }
    }
}