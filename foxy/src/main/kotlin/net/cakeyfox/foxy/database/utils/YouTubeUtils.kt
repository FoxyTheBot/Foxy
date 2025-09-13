package net.cakeyfox.foxy.database.utils

import com.mongodb.client.model.Filters.and
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.Updates.pull
import com.mongodb.client.model.Updates.push
import com.mongodb.client.model.Updates.set
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import mu.KotlinLogging
import net.cakeyfox.foxy.database.data.YouTubeWebhook
import net.cakeyfox.foxy.database.DatabaseClient
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

    suspend fun updateChannelCustomMessage(guildId: String, channelId: String, message: String?) {
        client.withRetry {
            client.guilds.updateOne(
                and(
                    eq("_id", guildId),
                    eq("followedYouTubeChannels.channelId", channelId)
                ),
                set("followedYouTubeChannels.$.notificationMessage", message)
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

    suspend fun getOrRegisterYouTubeWebhook(channelId: String): YouTubeWebhook {
        return client.withRetry {
            val collection = client.database.getCollection<Document>(YOUTUBE_WEBHOOKS)
            val youtubeChannel = collection.find(eq("channelId", channelId)).firstOrNull()
                ?: return@withRetry registerOrUpdateYouTubeWebhook(channelId)

            val documentToJSON = youtubeChannel.toJson()
            client.foxy.json.decodeFromString<YouTubeWebhook>(documentToJSON)
        }
    }

    suspend fun registerOrUpdateYouTubeWebhook(channelId: String): YouTubeWebhook {
        return client.withRetry {
            val collection = client.database.getCollection<Document>(YOUTUBE_WEBHOOKS)
            val query = eq("channelId", channelId)

            val newWebhook = YouTubeWebhook(
                channelId = channelId,
                createdAt = System.currentTimeMillis(),
                leaseSeconds = 432_000
            )

            val documentToJSON = client.foxy.json.encodeToString(newWebhook)
            val document = Document.parse(documentToJSON)

            val result = collection.replaceOne(query, document, ReplaceOptions().upsert(true))

            if (result.matchedCount == 0L) {
                logger.info { "Created new webhook for $channelId" }
            } else {
                logger.info { "Updated webhook for $channelId" }
            }

            newWebhook
        }
    }
}