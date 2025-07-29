package net.cakeyfox.foxy.utils

import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.tasks.BirthdayReminderTask
import net.cakeyfox.foxy.tasks.CakeInactivityTaxTask
import java.time.LocalTime

object TasksUtils {
    fun launchTasks(foxy: FoxyInstance) {
        scheduleCoroutine(foxy.tasksScope, at(0,30), CakeInactivityTaxTask(foxy))
        scheduleCoroutine(foxy.tasksScope, at(0, 0), BirthdayReminderTask(foxy))
    }

    private fun at(hour: Int, minute: Int): LocalTime {
        return LocalTime.of(hour, minute)
    }
}