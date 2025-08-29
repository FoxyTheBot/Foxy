package net.cakeyfox.foxy.utils.database

import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.database.utils.*
import net.cakeyfox.foxy.database.data.FoxyUser
import net.cakeyfox.foxy.database.data.FoxyverseGuild
import net.cakeyfox.foxy.database.data.Guild
import net.cakeyfox.foxy.database.data.YouTubeWebhook
import java.util.concurrent.TimeUnit

class DatabaseClient(
    val foxy: FoxyInstance
) {
    companion object {
        private val logger = KotlinLogging.logger {}
    }

    private lateinit var mongoClient: MongoClient
    lateinit var guilds: MongoCollection<Guild>
    lateinit var users: MongoCollection<FoxyUser>
    lateinit var foxyverseGuilds: MongoCollection<FoxyverseGuild>
    lateinit var youtubeWebhooks: MongoCollection<YouTubeWebhook>
    lateinit var database: MongoDatabase

    val profile = ProfileUtils(this)
    val guild = GuildUtils(this)
    val user = UserUtils(this, foxy)
    val bot = BotUtils(this)
    val youtube = YouTubeUtils(this)

    fun start() = connect()

    private fun connect() {
        try {
            mongoClient = MongoClient.create(foxy.config.database.address)
            mongoClient.withTimeout(10, TimeUnit.SECONDS)
            database = mongoClient.getDatabase(foxy.config.database.databaseName)
            users = database.getCollection("users")
            guilds = database.getCollection("guilds")
            foxyverseGuilds = database.getCollection("foxyverses")
            youtubeWebhooks = database.getCollection("youtubeWebhooks")

            logger.info { "Connected to ${foxy.config.database.databaseName} database" }
        } catch (e: Exception) {
            logger.error(e) { "Failed to connect to MongoDB" }
        }
    }

    private fun reconnect() {
        logger.warn { "Reconnecting to MongoDB..." }
        try {
            close()
        } catch (e: Exception) {
            logger.warn(e) { "Error closing MongoDB during reconnect" }
        }
        connect()
    }

    private suspend fun <T> withDatabaseRetry(
        retries: Int = 3,
        block: suspend MongoDatabase.() -> T
    ): T {
        var attempt = 0
        while (true) {
            try {
                return database.block()
            } catch (e: Exception) {
                logger.warn(e) { "Database operation failed (attempt ${attempt + 1}/$retries)" }
                if (++attempt >= retries) throw e
                reconnect()
            }
        }
    }

    suspend fun <T> withRetry(block: suspend MongoDatabase.() -> T): T {
        return withContext(foxy.coroutineDispatcher) {
            this@DatabaseClient.withDatabaseRetry(block = block)
        }
    }

    fun close() {
        try {
            mongoClient.close()
            logger.info { "Disconnected from MongoDB" }
        } catch (e: Exception) {
            logger.warn(e) { "Error while closing MongoDB client" }
        }
    }
}