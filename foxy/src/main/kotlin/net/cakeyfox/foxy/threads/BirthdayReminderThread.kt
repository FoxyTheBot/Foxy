package net.cakeyfox.foxy.threads

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.EmbedBuilder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.datetime.Instant
import kotlinx.datetime.toJavaInstant
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.FoxyLauncher
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.dv8tion.jda.api.entities.emoji.Emoji
import net.dv8tion.jda.api.utils.messages.MessageCreateData
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.concurrent.Executors
import kotlin.time.Duration.Companion.days
import kotlin.time.Duration.Companion.seconds

class BirthdayReminderThread(
    val foxy: FoxyInstance
) {
    private val coroutineExecutor = Executors.newFixedThreadPool(8) {
        Thread(it, "BirthdayReminderThread").apply {
            isDaemon = true
            contextClassLoader = FoxyLauncher::class.java.classLoader
        }
    }

    private val logger = KotlinLogging.logger { }
    private val locale = FoxyLocale("pt-br")
    private val scope = CoroutineScope(SupervisorJob() + coroutineExecutor.asCoroutineDispatcher())
    private val semaphore = Semaphore(5)
    private val javaZone: ZoneId = ZoneId.of(foxy.foxyZone.id)

    fun start() {
        scope.launch {
            while (true) {
                try {
                    logger.info { "Running birthday check using ${foxy.foxyZone.id}..." }
                    sendMessageToBirthdayPeople()
                } catch (e: Exception) {
                    logger.error(e) { "Error sending birthday messages" }
                }
                delay(1.days)
            }
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
            chunk.forEach { user ->
                launch {
                    semaphore.withPermit {
                        val birthday = user.userBirthday?.birthday.takeUnless { it == Instant.fromEpochMilliseconds(0) }
                            ?: return@launch
                        val lastMessage = user.userBirthday?.lastMessage

                        val nowZoned = ZonedDateTime.now(javaZone)
                        val birthdayZoned = ZonedDateTime.ofInstant(birthday.toJavaInstant(), javaZone)
                        val isBirthdayToday = birthdayZoned.dayOfMonth == nowZoned.dayOfMonth &&
                                birthdayZoned.month == nowZoned.month

                        logger.info { "Checking user ${user._id}: birthday=$birthdayZoned, now=$nowZoned, isBirthdayToday=$isBirthdayToday" }

                        try {
                            val hasReceivedThisYear = lastMessage?.let {
                                ZonedDateTime.ofInstant(it.toJavaInstant(), javaZone).year == nowZoned.year
                            } ?: false

                            val discordUser = foxy.shardManager.retrieveUserById(user._id).await()
                            if (isBirthdayToday && !hasReceivedThisYear) {
                                foxy.utils.sendDM(
                                    discordUser,
                                    MessageCreateData.fromEmbeds(
                                        EmbedBuilder {
                                            title = pretty(FoxyEmotes.FoxyCake, locale["birthday.title"])
                                            color = Colors.PURPLE
                                            description = locale[
                                                "birthday.message",
                                                FoxyEmotes.FoxyYay
                                            ]
                                        }.build()
                                    )
                                )

                                foxy.database.user.updateUser(
                                    user._id,
                                    mapOf("userBirthday.lastMessage" to nowZoned.toInstant())
                                )
                            }

                            logger.info { "Sent birthday message to ${user._id}" }
                        } catch (e: Exception) {
                            logger.error(e) { "Error processing birthday message for user ${user._id}" }
                        }
                    }
                }
            }
        }
    }
}