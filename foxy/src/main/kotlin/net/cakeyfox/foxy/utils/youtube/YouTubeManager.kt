package net.cakeyfox.foxy.utils.youtube

import com.github.benmanes.caffeine.cache.Caffeine
import io.ktor.client.request.forms.FormDataContent
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.url
import io.ktor.client.statement.bodyAsText
import io.ktor.http.Parameters
import io.ktor.http.encodeURLParameter
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.ClusterUtils
import net.cakeyfox.foxy.utils.PlaceholderUtils
import net.cakeyfox.foxy.utils.PlaceholderUtils.replacePlaceholders
import net.cakeyfox.serializable.data.utils.YouTubeQuery
import net.cakeyfox.serializable.data.utils.YouTubeQueryBody
import java.util.concurrent.TimeUnit

class YouTubeManager(
    private val foxy: FoxyInstance
) {
    private val youtubeApiKey = foxy.config.youtube.key
    private val cachedChannels = Caffeine.newBuilder()
        .expireAfterWrite(1, TimeUnit.HOURS)
        .maximumSize(500)
        .build<String, YouTubeQueryBody>()
    private val cachedQueries = Caffeine.newBuilder()
        .expireAfterWrite(1, TimeUnit.HOURS)
        .maximumSize(500)
        .build<String, String>()


    companion object {
        private val logger = KotlinLogging.logger { }
        private val replacePlaceholders = PlaceholderUtils::replacePlaceholders
    }

    suspend fun createWebhook(channelId: String) {
        try {
            val response = foxy.httpClient.post {
                url(Constants.PUBSUBHUBBUB_SUBSCRIBE)
                setBody(
                    FormDataContent(
                        Parameters.build {
                            append("hub.callback", foxy.config.youtube.webhookUrl)
                            append("hub.mode", "subscribe")
                            append("hub.topic", "${Constants.YOUTUBE_FEED}?channel_id=$channelId")
                            append("hub.verify", "async")
                            append("hub.secret", foxy.config.youtube.webhookSecret)
                        }
                    )
                )
            }

            if (response.status.value in listOf(202, 204)) {
                foxy.database.youtube.getOrRegisterYouTubeWebhook(channelId)
            } else {
                logger.warn { "Failed to create webhook for $channelId! Received ${response.status}" }
            }
        } catch (e: Exception) {
            logger.error(e) { "Error while creating webhook!" }
        }
    }

    suspend fun notifyGuilds(channelId: String, author: String, videoUrl: String, videoId: String) {
        val guildsThatFollow = foxy.database.guild.getGuildsByFollowedYouTubeChannel(channelId)

        guildsThatFollow.forEach { guild ->
            val guildShard = ClusterUtils.getShardIdFromGuildId(guild._id.toLong(), foxy.config.discord.totalShards)
            val guildCluster = ClusterUtils.getClusterByShardId(foxy, guildShard)
            val currentChannel = guild.followedYouTubeChannels.find { it.channelId == channelId } ?: return@forEach

            if (currentChannel.notifiedVideos?.any { it.id == videoId } ?: false) {
                return@forEach
            } else foxy.database.youtube.addVideoToList(guild._id, channelId, videoId)
            logger.info { "Sending $author new video to guild ${guild._id}" }

            foxy.utils.sendMessageToAGuildChannel(
                guild,
                guildCluster,
                channelId = currentChannel.channelToSend.toString()
            ) {
                content = replacePlaceholders(
                    currentChannel.notificationMessage ?: "Novo vídeo de **$author**: $videoUrl",
                    PlaceholderUtils.getYouTubeChannelPlaceholders(
                        channelId = currentChannel.channelId,
                        videoUrl = videoUrl,
                        channelName = author
                    )
                )
            }
        }
    }

    suspend fun getChannelInfo(channel: String): YouTubeQueryBody? {
        val channelIdRegex = Regex("^UC[A-Za-z0-9_-]{22}$")
        val channelUrlRegex = Regex("youtube\\.com/(?:channel/|c/|user/|@)([A-Za-z0-9_-]+)", RegexOption.IGNORE_CASE)

        return try {
            when {
                channelIdRegex.matches(channel) -> {
                    cachedChannels.getIfPresent(channel)?.let { return it }

                    val request = foxy.httpClient.get {
                        url("https://www.googleapis.com/youtube/v3/channels?part=snippet&id=$channel&key=$youtubeApiKey")
                    }.bodyAsText()

                    val result = foxy.json.decodeFromString<YouTubeQueryBody>(request)
                    cachedChannels.put(channel, result)
                    result
                }

                channelUrlRegex.containsMatchIn(channel) -> {
                    val match = channelUrlRegex.find(channel)!!
                    val identifier = match.groupValues[1]

                    if (channelIdRegex.matches(identifier)) {
                        return getChannelInfo(identifier)
                    } else {
                        return getChannelInfo(identifier)
                    }
                }

                else -> {
                    val cachedId = cachedQueries.getIfPresent(channel)
                    if (cachedId != null) {
                        return cachedChannels.getIfPresent(cachedId) ?: getChannelInfo(cachedId)
                    }

                    val request = foxy.httpClient.get {
                        url("https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channel.encodeURLParameter()}&type=channel&key=$youtubeApiKey")
                    }.bodyAsText()

                    val response = foxy.json.decodeFromString<YouTubeQuery>(request)
                    val channelId = response.items.firstOrNull()?.id?.channelId ?: return null

                    cachedQueries.put(channel, channelId)
                    getChannelInfo(channelId)
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "Error while getting channel info!" }
            null
        }
    }
}