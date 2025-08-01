package net.cakeyfox.foxy.tasks

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.EmbedBuilder
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.datetime.Clock
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.RunnableCoroutine
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.dv8tion.jda.api.utils.messages.MessageCreateData
import kotlin.time.Duration.Companion.days

class DailyReminderTask(
    val foxy: FoxyInstance
) : RunnableCoroutine {
    private val logger = KotlinLogging.logger(this::class.simpleName!!)
    private val locale = FoxyLocale("pt-br")
    private val semaphore = Semaphore(10)

    override suspend fun run() {
        try {
            runDailyReminder()
        } catch (e: Exception) {
            logger.error(e) { "Error running daily reminder task" }
        }
    }

    private suspend fun runDailyReminder() = coroutineScope {
        val now = Clock.System.now()
        val maxInactivity = now - 90.days
        val usersToNotify = foxy.database.user.getExpiredDailies()
            .filter { it.userCakes.lastDaily != null && it.userCakes.lastDaily!! > maxInactivity }

        usersToNotify.chunked(10).forEach { chunk ->
            chunk.map { user ->
                semaphore.withPermit {
                    try {
                        if (user.userCakes.notifiedForDaily == true) return@withPermit
                        val discordUser = foxy.shardManager.retrieveUserById(user._id).await()

                        foxy.utils.sendDM(
                            discordUser,
                            MessageCreateData.fromEmbeds(
                                EmbedBuilder {
                                    title = pretty(FoxyEmotes.FoxyHowdy, locale["dailyReminder.embed.title"])
                                    description = locale["dailyReminder.embed.description", user._id]
                                    color = Colors.FOXY_DEFAULT
                                    thumbnail = Constants.DAILY_EMOJI
                                }.build()
                            )
                        )

                        foxy.database.user.updateUser(
                            user._id,
                            mapOf("userCakes.notifiedForDaily" to true)
                        )
                        logger.info { "Sent daily reminder to ${user._id}" }
                    } catch (e: Exception) {
                        logger.error(e) { "Error running daily reminder task" }
                    }
                }
            }
        }
    }
}