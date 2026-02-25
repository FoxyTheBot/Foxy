package net.cakeyfox.foxy.tasks

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.datetime.Instant
import kotlinx.datetime.daysUntil
import kotlinx.datetime.toKotlinInstant
import kotlinx.datetime.toLocalDateTime
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.RunnableCoroutine
import net.cakeyfox.foxy.utils.linkButton
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.PremiumUtils.canBypassInactivityTax
import net.cakeyfox.foxy.utils.logging.task
import java.time.ZoneId
import java.time.ZonedDateTime

class CakeInactivityTaxTask(
    private val foxy: FoxyInstance
) : RunnableCoroutine {
    companion object {
        private const val MINIMUM_AMOUNT = 100_000
        private const val TAX_PERCENTAGE = 0.5

        private const val WARNING_DAYS = 15
        private const val TAX_START_DAYS = 30
        private const val TAX_INTERVAL_DAYS = 7
    }

    private val logger = KotlinLogging.logger(this::class.simpleName!!)
    private val locale = FoxyLocale("pt-br")
    private val formattedMinimumAmount = foxy.utils.formatLongNumber(MINIMUM_AMOUNT.toLong())
    private val semaphore = Semaphore(10)

    override suspend fun run() {
        try {
            logger.task { "Checking inactive users with cakes..." }
            applyInactivityTax()
        } catch (e: Exception) {
            logger.error(e) { "Error applying inactivity tax" }
        }
    }

    private suspend fun applyInactivityTax() = coroutineScope {
        val users = foxy.database.users.find().toList()
        val nowZoned = ZonedDateTime.now(ZoneId.systemDefault()).toInstant()
        val now = Instant.fromEpochMilliseconds(nowZoned.toEpochMilli())

        users.chunked(10).forEach { chunk ->
            chunk.map { user ->
                semaphore.withPermit {
                    if (canBypassInactivityTax(user)) {
                        logger.info { "Skipping inactive user ${user._id}" }
                        return@withPermit
                    }

                    try {
                        val lastDaily = user.userCakes.lastDaily?.takeUnless {
                            it == Instant.fromEpochMilliseconds(0)
                        } ?: return@withPermit

                        val tax = (user.userCakes.balance * TAX_PERCENTAGE).toLong()
                        val lastTax = user.userCakes.lastInactivityTax
                        val daysSinceLastDaily = lastDaily.toLocalDateTime(foxy.foxyZone)
                            .date.daysUntil(now.toLocalDateTime(foxy.foxyZone).date)

                        val daysSinceLastTax = lastTax?.toLocalDateTime(foxy.foxyZone)
                            ?.date?.daysUntil(now.toLocalDateTime(foxy.foxyZone).date)
                            ?: Int.MAX_VALUE
                        val formattedBalance = foxy.utils.formatLongNumber(user.userCakes.balance.toLong())
                        val formattedTax = foxy.utils.formatLongNumber(tax)

                        if (user.userCakes.balance <= MINIMUM_AMOUNT) return@withPermit

                        if (daysSinceLastDaily in WARNING_DAYS until TAX_START_DAYS) {
                            if (user.userCakes.warnedAboutInactivityTax != true) {
                                val userFromDiscord = foxy.shardManager.retrieveUserById(user._id).await()
                                foxy.utils.sendDirectMessage(userFromDiscord) {
                                    embed {
                                        title = pretty(
                                            FoxyEmotes.FoxyCry,
                                            locale[
                                                "tax.cakes.warning.title"
                                            ]
                                        )
                                        description = locale[
                                            "tax.cakes.warning.description",
                                            user._id,
                                            formattedMinimumAmount,
                                            WARNING_DAYS.toString(),
                                            formattedBalance,
                                            formattedTax
                                        ]
                                        thumbnail = Constants.FOXY_CRY
                                        color = Colors.FOXY_DEFAULT
                                    }

                                    actionRow(
                                        linkButton(
                                            FoxyEmotes.FoxyDaily,
                                            locale["tax.cakes.button"],
                                            Constants.DAILY
                                        )
                                    )
                                }
                                foxy.database.user.updateUser(user._id) {
                                    userCakes.warnedAboutInactivityTax = true
                                }

                                logger.task { "${user._id} warned about inactivity tax" }
                            }
                        }

                        if (daysSinceLastDaily >= TAX_START_DAYS && daysSinceLastTax >= TAX_INTERVAL_DAYS) {
                            val tax = (user.userCakes.balance * TAX_PERCENTAGE).toLong()
                            val userFromDiscord = foxy.shardManager.retrieveUserById(user._id).await()
                            val formattedTax = foxy.utils.formatLongNumber(tax)

                            foxy.utils.sendDirectMessage(userFromDiscord) {
                                embed {
                                    title = pretty(FoxyEmotes.FoxyCry, locale["tax.cakes.title"])
                                    description = locale[
                                        "tax.cakes.description",
                                        user._id,
                                        formattedTax
                                    ]
                                    thumbnail = Constants.FOXY_CRY
                                    color = Colors.FOXY_DEFAULT
                                }

                                actionRow(
                                    linkButton(
                                        FoxyEmotes.FoxyDaily,
                                        locale["tax.cakes.button"],
                                        Constants.DAILY
                                    )
                                )
                            }

                            foxy.database.user.removeCakesFromUser(user._id, tax)
                            foxy.database.user.updateUser(user._id) {
                                userCakes.warnedAboutInactivityTax = false
                                userCakes.lastInactivityTax = nowZoned.toKotlinInstant()
                            }

                            logger.task { "$tax Cakes removed from ${user._id}" }
                        }
                    } catch (e: Exception) {
                        logger.error(e) { "Error processing inactivity tax for user ${user._id}" }
                    }
                }
            }
        }
    }
}