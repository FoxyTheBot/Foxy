package net.cakeyfox.foxy.tasks

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.RunnableCoroutine
import net.cakeyfox.foxy.utils.linkButton
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.foxy.utils.logging.task

class UpvoteReminderTask(
    private val foxy: FoxyInstance
) : RunnableCoroutine {
    private val locale = FoxyLocale("pt-br")
    private val semaphore = Semaphore(10)
    private val logger = KotlinLogging.logger(this::class.simpleName!!)

    override suspend fun run() {
        try {
            logger.task { "Running upvote reminder task..." }
            checkVotes()
        } catch (e: Exception) {
            logger.error(e) { "Error running upvote reminder task" }
        }
    }

    private suspend fun checkVotes() = coroutineScope {
        val usersToNotify = foxy.database.user.getExpiredVotes()

        usersToNotify.chunked(5).forEach { chunk ->
            chunk.map { user ->
                semaphore.withPermit {
                    try {
                        if (user.notifiedForVote == true) return@withPermit
                        val discordUser = foxy.shardManager.retrieveUserById(user._id).await()

                        foxy.utils.sendDirectMessage(discordUser) {
                            embed {
                                title = pretty(FoxyEmotes.FoxyYay, locale["upvote.reminder.title"])
                                description = locale["upvote.reminder.message", user._id]
                                footer(locale["upvote.reminder.footer"])
                                color = Colors.FOXY_DEFAULT
                                thumbnail = Constants.FOXY_FUMO
                            }

                            actionRow(
                                linkButton(
                                    FoxyEmotes.FoxyYay,
                                    locale["upvote.reminderButton"],
                                    Constants.UPVOTE_URL
                                )
                            )
                        }

                        foxy.database.user.updateUser(user._id) {
                            notifiedForVote = true
                        }

                        logger.task { "Sent upvote reminder to ${user._id}" }
                    } catch (e: Exception) {
                        logger.error(e) { "Error sending upvote reminder to user ${user._id}" }
                    }
                }
            }
        }
    }
}