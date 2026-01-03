package net.cakeyfox.foxy.tasks

import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.RunnableCoroutine
import net.cakeyfox.foxy.utils.logging.task
import java.time.Instant
import java.util.concurrent.atomic.AtomicInteger

class CreateYouTubeWebhookTask(
    private val foxy: FoxyInstance
) : RunnableCoroutine {
    companion object {
        private val logger = KotlinLogging.logger { }
    }

    override suspend fun run() {
        try {
            val allChannels = foxy.database.youtube.getAllFollowedYouTubeChannelIds()
            val webhooks = foxy.database.youtube.getYouTubeWebhooks().associateBy { it.channelId }

            logger.task {
                "Running YouTube task... checking ${allChannels.size} followed channels, " +
                        "currently ${webhooks.size} webhooks stored."
            }

            val expiredOrMissing = allChannels.filter { channelId ->
                val webhook = webhooks[channelId] ?: return@filter true
                val expireAt = Instant.ofEpochMilli(webhook.createdAt + (webhook.leaseSeconds * 1000))
                Instant.now().isAfter(expireAt)
            }

            if (expiredOrMissing.isEmpty()) {
                logger.info { "No expired YouTube webhooks to renew." }
                return
            }

            logger.info { "I will renew ${expiredOrMissing.size} YouTube channel webhooks..." }

            val renewedCount = AtomicInteger()

            coroutineScope {
                val tasks = expiredOrMissing.map { webhook ->
                    async(start = CoroutineStart.LAZY) {
                        try {
                            foxy.youtubeManager.createWebhook(webhook)
                            val created = renewedCount.incrementAndGet()
                            logger.info { "$webhook webhook renewed! $created/${expiredOrMissing.size}" }

                            webhook
                        } catch (e: Exception) {
                            logger.error(e) { "Error renewing webhook for $webhook" }
                            null
                        }
                    }
                }

                tasks.forEachIndexed { index, deferred ->
                    val channelId = deferred.await()
                    if (channelId != null) {
                        foxy.database.youtube.getOrRegisterYouTubeWebhook(channelId)
                    }

                    if (index % 50 == 0 && index != 0) {
                        logger.info { "Checkpoint: renewed $index webhooks so far..." }
                    }
                }
            }

            logger.info { "YouTube webhook task finished, renewed ${renewedCount.get()} webhooks." }
        } catch (e: Exception) {
            logger.error(e) { "Error while running YouTube webhook task" }
        }
    }
}
