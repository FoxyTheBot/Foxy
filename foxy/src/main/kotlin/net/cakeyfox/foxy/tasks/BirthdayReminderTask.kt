package net.cakeyfox.foxy.tasks

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.datetime.Instant
import kotlinx.datetime.toJavaInstant
import kotlinx.datetime.toKotlinInstant
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.RunnableCoroutine
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.logging.task
import java.time.ZoneId
import java.time.ZonedDateTime


class BirthdayReminderTask(
    val foxy: FoxyInstance
) : RunnableCoroutine {
    private val logger = KotlinLogging.logger(this::class.simpleName!!)
    private val locale = FoxyLocale("pt-br")
    private val semaphore = Semaphore(5)
    private val javaZone: ZoneId = ZoneId.of(foxy.foxyZone.id)

    override suspend fun run() {
        try {
            logger.task { "Running birthday check using ${foxy.foxyZone.id}..." }
            sendMessageToBirthdayPeople()
        } catch (e: Exception) {
            logger.error(e) { "Error sending birthday messages" }
        }
    }

    private suspend fun sendMessageToBirthdayPeople() = coroutineScope {
        val allUsers = foxy.database.users.find().toList()
        val users = allUsers.filter {
            it.userBirthday != null
                    && it.userBirthday?.birthday != Instant.fromEpochMilliseconds(0)
                    && it.userBirthday?.isEnabled == true
        }

        users.chunked(5).forEach { chunk ->
            chunk.map { user ->
                semaphore.withPermit {
                    val birthday = user.userBirthday?.birthday.takeUnless {
                        it == Instant.fromEpochMilliseconds(0)
                    } ?: return@forEach
                    val lastMessage = user.userBirthday?.lastMessage

                    val nowZoned = ZonedDateTime.now(javaZone)
                    val birthdayZoned = ZonedDateTime.ofInstant(birthday.toJavaInstant(), javaZone)
                    val isBirthdayToday = birthdayZoned.dayOfMonth == nowZoned.dayOfMonth &&
                            birthdayZoned.month == nowZoned.month

                    try {
                        val hasReceivedThisYear = lastMessage?.let {
                            ZonedDateTime.ofInstant(it.toJavaInstant(), javaZone).year == nowZoned.year
                        } ?: false

                        val discordUser = foxy.shardManager.retrieveUserById(user._id).await()
                        if (isBirthdayToday && !hasReceivedThisYear) {
                            foxy.utils.sendDirectMessage(discordUser) {
                                embed {
                                    title = pretty(
                                        FoxyEmotes.FoxyCake,
                                        locale["birthday.title"]
                                    )
                                    color = Colors.PURPLE
                                    description = locale["birthday.message", FoxyEmotes.FoxyYay]
                                    thumbnail = Constants.FOXY_WOW
                                }
                            }

                            foxy.database.user.updateUser(user._id) {
                                userBirthday.lastMessage = nowZoned.toInstant().toKotlinInstant()
                            }

                            logger.task { "Sent birthday message to ${user._id}" }
                        }
                    } catch (e: Exception) {
                        logger.error(e) { "Error processing birthday message for user ${user._id}" }
                    }
                }
            }
        }
    }
}