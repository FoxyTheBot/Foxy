package net.cakeyfox.foxy.utils

import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.tasks.BirthdayReminderTask
import net.cakeyfox.foxy.tasks.CakeInactivityTaxTask
import java.time.LocalTime

object TasksUtils {
    fun launchTasks(foxy: FoxyInstance) {
        scheduleCoroutine(CakeInactivityTaxTask(foxy),at(0,30), foxy.tasksScope)
        scheduleCoroutine(BirthdayReminderTask(foxy),at(21, 35), foxy.tasksScope)
    }

    private fun at(hour: Int, minute: Int): LocalTime {
        return LocalTime.of(hour, minute)
    }
}