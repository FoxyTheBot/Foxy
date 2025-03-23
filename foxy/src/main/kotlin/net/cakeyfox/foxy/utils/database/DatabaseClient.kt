package net.cakeyfox.foxy.utils.database

import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.database.utils.*
import net.cakeyfox.serializable.database.data.FoxyUser
import net.cakeyfox.serializable.database.data.Guild
import java.util.concurrent.TimeUnit

class DatabaseClient(
    foxy: FoxyInstance
) {
    companion object {
        private var logger = KotlinLogging.logger { }
    }

    private lateinit var mongoClient: MongoClient
    private lateinit var guilds: MongoCollection<Guild>
    lateinit var users: MongoCollection<FoxyUser>
    lateinit var database: MongoDatabase

    val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    val profile = ProfileUtils(this)
    val economy = EconomyUtils(this)
    val guild = GuildUtils(this)
    val user = UserUtils(this, foxy)
    val bot = BotUtils(this)

    fun start(foxy: FoxyInstance) {
        mongoClient = MongoClient.create(foxy.config.database.uri)
        mongoClient.withTimeout(10, TimeUnit.SECONDS)
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