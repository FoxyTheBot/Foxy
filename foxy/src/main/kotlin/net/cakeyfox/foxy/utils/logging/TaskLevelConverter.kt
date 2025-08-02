package net.cakeyfox.foxy.utils.logging

import ch.qos.logback.classic.pattern.LevelConverter
import ch.qos.logback.classic.spi.ILoggingEvent

class TaskLevelConverter : LevelConverter() {
    override fun convert(event: ILoggingEvent): String {
        val markerName = event.marker?.name
        return when {
            markerName == "TASK" -> "\u001B[35mTASK\u001B[0m  "
            else -> super.convert(event)
        }
    }
}