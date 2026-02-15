package net.cakeyfox.foxy.tasks

import dev.minn.jda.ktx.coroutines.await
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
import net.cakeyfox.foxy.utils.linkButton
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.logging.task
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
        val maxInactivity = now - 60.days
        val usersToNotify = foxy.database.user.getExpiredDailies()
            .filter { it.userCakes.lastDaily != null && it.userCakes.lastDaily!! > maxInactivity }

        usersToNotify.chunked(10).forEach { chunk ->
            chunk.map { user ->
                semaphore.withPermit {
                    try {
                        if (user.userCakes.notifiedForDaily == true) return@withPermit
                        val discordUser = foxy.shardManager.retrieveUserById(user._id).await()

                        foxy.utils.sendDirectMessage(discordUser) {
                            embed {
                                title = pretty(
                                    FoxyEmotes.FoxyHowdy,
                                    locale["dailyReminder.embed.title"]
                                )
                                description = locale["dailyReminder.embed.description", user._id]
                                color = Colors.FOXY_DEFAULT
                                thumbnail = Constants.DAILY_EMOJI
                            }

                            actionRow(
                                linkButton(
                                    FoxyEmotes.FoxyDaily,
                                    locale["dailyReminder.button"],
                                    Constants.DAILY
                                )
                            )
                        }

                        foxy.database.user.updateUser(user._id) {
                            userCakes.notifiedForDaily = true
                        }
                        logger.task { "Sent daily reminder to ${user._id}" }
                    } catch (e: Exception) {
                        logger.error(e) { "Error running daily reminder task" }
                    }
                }
            }
        }
    }
}