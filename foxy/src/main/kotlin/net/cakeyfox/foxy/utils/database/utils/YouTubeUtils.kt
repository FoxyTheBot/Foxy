package net.cakeyfox.foxy.utils.database.utils

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.Updates.pull
import com.mongodb.client.model.Updates.push
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import mu.KotlinLogging
import net.cakeyfox.foxy.database.data.YouTubeWebhook
import net.cakeyfox.foxy.utils.database.DatabaseClient
import org.bson.Document
import java.time.Instant

class YouTubeUtils(
    private val client: DatabaseClient
) {
    private val logger = KotlinLogging.logger {}

    companion object {
        private const val YOUTUBE_WEBHOOKS = "youtubeWebhooks"
    }

    suspend fun removeChannelFromGuild(guildId: String, channelId: String) {
        client.withRetry {
            client.guilds.updateOne(
                eq("_id", guildId),
                pull("followedYouTubeChannels", Document("channelId", channelId))
            )
        }
    }

    suspend fun getAllFollowedYouTubeChannelIds(): List<String> {
        val guilds = client.guilds.find().toList()

        return guilds
            .flatMap { guild -> guild.followedYouTubeChannels.map { it.channelId } }
            .distinct()
    }

    suspend fun addChannelToAGuild(guildId: String, channelId: String, textChannelId: String, message: String?) {
        client.withRetry {
            val channelDoc = mapOf(
                "channelId" to channelId,
                "notificationMessage" to message,
                "channelToSend" to textChannelId,
                "notifiedVideos" to emptyList<String>()
            )

            client.guilds.updateOne(
                eq("_id", guildId),
                push("followedYouTubeChannels", channelDoc)
            )
        }
    }

    suspend fun addVideoToList(guildId: String, channelId: String, videoId: String) {
        return client.withRetry {
            val query = Document("_id", guildId)

            val update = Document(
                "\$push", Document(
                    "followedYouTubeChannels.$[elem].notifiedVideos",
                    Document("id", videoId).append("notifiedAt", Instant.now())
                )
            )

            val options = UpdateOptions().arrayFilters(
                listOf(Document("elem.channelId", channelId))
            )

            client.guilds.updateOne(query, update, options)
        }
    }

    suspend fun getYouTubeWebhooks(): List<YouTubeWebhook> {
        return client.withRetry {
            val webhooks = client.youtubeWebhooks.find().toList()

            webhooks
        }
    }

    suspend fun getYouTubeWebhookByChannelId(channelId: String): YouTubeWebhook? {
        return client.withRetry {
            val collection = client.database.getCollection<Document>(YOUTUBE_WEBHOOKS)
            val youtubeChannel = collection.find(eq("channelId", channelId)).firstOrNull() ?: return@withRetry null

            val documentToJSON = youtubeChannel.toJson()
            client.foxy.json.decodeFromString<YouTubeWebhook>(documentToJSON)
        }
    }

    suspend fun getOrRegisterYouTubeWebhook(channelId: String): YouTubeWebhook {
        return client.withRetry {
            val collection = client.database.getCollection<Document>(YOUTUBE_WEBHOOKS)
            val youtubeChannel = collection.find(eq("channelId", channelId)).firstOrNull()
                ?: return@withRetry registerYouTubeWebhook(channelId)

            val documentToJSON = youtubeChannel.toJson()
            client.foxy.json.decodeFromString<YouTubeWebhook>(documentToJSON)
        }
    }

    suspend fun registerYouTubeWebhook(channelId: String): YouTubeWebhook {
        return client.withRetry {
            val collection = client.database.getCollection<Document>(YOUTUBE_WEBHOOKS)
            val query = eq("channelId", channelId)
            val existingDocument = collection.find(query).firstOrNull()
            if (existingDocument != null) {
                logger.warn { "Webhook for $channelId already exists! Skipping..." }

                val documentToJSON = client.foxy.json.decodeFromString<YouTubeWebhook>(existingDocument.toJson())
                return@withRetry documentToJSON
            }

            logger.info { "Created webhook for $channelId" }
            val newWebhook = YouTubeWebhook(
                channelId = channelId,
                createdAt = System.currentTimeMillis(),
                leaseSeconds = 432_000
            )

            val documentToJSON = client.foxy.json.encodeToString(newWebhook)
            val document = Document.parse(documentToJSON)

            collection.insertOne(document)
            newWebhook
        }
    }
}