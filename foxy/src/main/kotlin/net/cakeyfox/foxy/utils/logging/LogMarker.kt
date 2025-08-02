package net.cakeyfox.foxy.utils.logging

import mu.KLogger
import org.slf4j.MarkerFactory

private val TASK_MARKER = MarkerFactory.getMarker("TASK")

fun KLogger.task(msg: () -> Any?) {
    if (isInfoEnabled) {
        info(TASK_MARKER, msg)
    }
}