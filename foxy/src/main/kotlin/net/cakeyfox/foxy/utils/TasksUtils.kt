package net.cakeyfox.foxy.utils

import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.tasks.BirthdayReminderTask
import net.cakeyfox.foxy.tasks.CakeInactivityTaxTask
import net.cakeyfox.foxy.tasks.DailyReminderTask
import net.cakeyfox.foxy.tasks.UpvoteReminderTask
import java.time.LocalTime
import kotlin.time.Duration.Companion.hours

object TasksUtils {
    fun launchTasks(foxy: FoxyInstance) {
        scheduleCoroutine(BirthdayReminderTask(foxy),at(0, 0), foxy.tasksScope)
        scheduleCoroutine(CakeInactivityTaxTask(foxy),at(0,15), foxy.tasksScope)
        scheduleCoroutine(DailyReminderTask(foxy),at(0, 30), foxy.tasksScope)
        scheduleCoroutineAtFixedRate(
            taskName = UpvoteReminderTask::class.simpleName!!,
            scope = foxy.tasksScope,
            period = 2.hours,
            action = UpvoteReminderTask(foxy)
        )
    }

    private fun at(hour: Int, minute: Int): LocalTime {
        return LocalTime.of(hour, minute)
    }
}