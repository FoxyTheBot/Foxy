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
import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.daysUntil
import kotlinx.datetime.toLocalDateTime
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.dv8tion.jda.api.utils.messages.MessageCreateData
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class CakeInactivityTaxThread(
    private val foxy: FoxyInstance
) {
    companion object {
        private val logger = KotlinLogging.logger { }
        private val zone = TimeZone.currentSystemDefault()

        private const val MINIMUM_AMOUNT = 500_000
        private const val TAX_PERCENTAGE = 0.15

        private const val WARNING_DAYS = 15
        private const val TAX_START_DAYS = 30
        private const val TAX_INTERVAL_DAYS = 7
    }

    private val coroutineExecutor = Executors.newFixedThreadPool(8) {
        Thread(it, "CakeInactivityTaxThread").apply { isDaemon = true }
    }
    private val locale = FoxyLocale("pt-BR")
    private val formattedMinimumAmount = foxy.utils.formatLongNumber(MINIMUM_AMOUNT.toLong())
    private val scope = CoroutineScope(SupervisorJob() + coroutineExecutor.asCoroutineDispatcher())
    private val semaphore = Semaphore(10)

    fun start() {
        scope.launch {
            while (true) {
                try {
                    logger.info { "Checking inactive users with cakes..." }
                    applyInactivityTax()
                } catch (e: Exception) {
                    logger.error(e) { "Error applying inactivity tax" }
                }
                delay(TimeUnit.HOURS.toMillis(24))
            }
        }
    }

    private suspend fun applyInactivityTax() = coroutineScope {
        val users = foxy.database.users.find().toList()
        val nowZoned = ZonedDateTime.now(ZoneId.systemDefault()).toInstant()
        val now = Instant.fromEpochMilliseconds(nowZoned.toEpochMilli())

        users.forEach { user ->
            launch {
                semaphore.acquire()
                try {
                    val lastDaily = user.userCakes.lastDaily?.takeUnless { it == Instant.fromEpochMilliseconds(0) }
                        ?: return@launch

                    val tax = (user.userCakes.balance * TAX_PERCENTAGE).toLong()
                    val lastTax = user.userCakes.lastInactivityTax
                    val daysSinceLastDaily =
                        lastDaily.toLocalDateTime(zone).date.daysUntil(now.toLocalDateTime(zone).date)
                    val daysSinceLastTax =
                        lastTax?.toLocalDateTime(zone)?.date?.daysUntil(now.toLocalDateTime(zone).date)
                            ?: Int.MAX_VALUE
                    val formattedBalance = foxy.utils.formatLongNumber(user.userCakes.balance.toLong())
                    val formattedTax = foxy.utils.formatLongNumber(tax)

                    if (user.userCakes.balance <= MINIMUM_AMOUNT) return@launch

                    if (daysSinceLastDaily >= WARNING_DAYS && daysSinceLastDaily < TAX_START_DAYS) {
                        if (user.userCakes.warnedAboutInactivityTax != true) {
                            val userFromDiscord = foxy.shardManager.retrieveUserById(user._id).await()
                            foxy.utils.sendDM(
                                userFromDiscord,
                                MessageCreateData.fromEmbeds(
                                    EmbedBuilder {
                                        title = pretty(FoxyEmotes.FoxyCry, locale["tax.cakes.warning.title"])
                                        description = locale[
                                            "tax.cakes.warning.description",
                                            user._id,
                                            formattedMinimumAmount,
                                            WARNING_DAYS.toString(),
                                            formattedBalance,
                                            formattedTax,
                                            Constants.DAILY
                                        ]
                                        thumbnail = Constants.FOXY_CRY
                                        color = Colors.FOXY_DEFAULT
                                    }.build()
                                )
                            )
                            foxy.database.user.updateUser(
                                user._id,
                                mapOf("userCakes.warnedAboutInactivityTax" to true)
                            )
                        }
                    }

                    if (daysSinceLastDaily >= TAX_START_DAYS && daysSinceLastTax >= TAX_INTERVAL_DAYS) {
                        val tax = (user.userCakes.balance * TAX_PERCENTAGE).toLong()
                        val userFromDiscord = foxy.shardManager.retrieveUserById(user._id).await()
                        val formattedTax = foxy.utils.formatLongNumber(tax)

                        foxy.utils.sendDM(
                            userFromDiscord,
                            MessageCreateData.fromEmbeds(
                                EmbedBuilder {
                                    title = pretty(FoxyEmotes.FoxyCry, locale["tax.cakes.title"])
                                    description = locale[
                                        "tax.cakes.description",
                                            user._id,
                                            formattedTax,
                                            Constants.DAILY
                                        ]
                                    thumbnail = Constants.FOXY_CRY
                                    color = Colors.FOXY_DEFAULT
                                }.build()
                            )
                        )

                        foxy.database.user.removeCakesFromUser(user._id, tax)
                        foxy.database.user.updateUser(
                            user._id,
                            mapOf(
                                "userCakes.lastInactivityTax" to nowZoned,
                                "userCakes.warnedAboutInactivityTax" to false
                            )
                        )
                    }
                } catch (e: Exception) {
                    logger.error(e) { "Error processing inactivity tax for user ${user._id}" }
                } finally {
                    semaphore.release()
                }
            }
        }
    }
}
