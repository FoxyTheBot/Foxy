package net.cakeyfox.foxy.utils

import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId
import kotlin.time.Duration
import kotlin.time.Duration.Companion.days
import kotlin.time.toKotlinDuration

/**
 * Schedules [action] to be executed on [scope] every [period] with a [initialDelay]
 */
fun scheduleCoroutineAtFixedRate(
    taskName: String,
    scope: CoroutineScope,
    period: Duration,
    initialDelay: Duration = Duration.ZERO,
    action: RunnableCoroutine
) {
    val logger = KotlinLogging.logger(taskName)

    scope.launch(CoroutineName("$taskName Scheduler")) {
        delay(initialDelay)

        val mutex = Mutex()

        while (true) {
            launch(CoroutineName("$taskName Task")) {
                logger.info { "Preparing to run task - Is mutex locked? ${mutex.isLocked}" }
                mutex.withLock {
                    logger.info { "Running task..." }
                    try {
                        action.run()
                    } catch (e: Throwable) {
                        logger.warn(e) { "Uncaught error when running the task!" }
                    }
                    logger.info { "Task has finished running!" }
                }
            }
            logger.info { "Waiting $period to execute next task..." }
            delay(period)
        }
    }
}

fun scheduleCoroutine(
    action: RunnableCoroutine,
    targetTime: LocalTime,
    scope: CoroutineScope,
) {
    val logger = KotlinLogging.logger { }
    logger.info { "Scheduled task: ${action::class.simpleName!!}" }

    val now = LocalDateTime.now(ZoneId.of(Constants.FOXY_TIMEZONE))
    val nextRun = if (now.toLocalTime().isBefore(targetTime)) {
        now.with(targetTime)
    } else {
        now.plusDays(1).with(targetTime)
    }

    val delayDuration = java.time.Duration.between(now, nextRun)

    scheduleCoroutineAtFixedRate(
        action::class.simpleName!!,
        scope,
        1.days,
        delayDuration.toKotlinDuration(),
        action
    )
}

fun interface RunnableCoroutine {
    suspend fun run()
}