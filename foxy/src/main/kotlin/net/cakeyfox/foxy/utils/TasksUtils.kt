package net.cakeyfox.foxy.utils

import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.tasks.BirthdayReminderTask
import net.cakeyfox.foxy.tasks.CakeInactivityTaxTask
import net.cakeyfox.foxy.tasks.CheckExpiredBansTask
import net.cakeyfox.foxy.tasks.CreateYouTubeWebhookTask
import net.cakeyfox.foxy.tasks.DailyReminderTask
import net.cakeyfox.foxy.tasks.PostTopggStatsTask
import net.cakeyfox.foxy.tasks.UpdateStoreTask
import net.cakeyfox.foxy.tasks.UpvoteReminderTask
import java.time.LocalTime
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

object TasksUtils {
    fun launchTasks(foxy: FoxyInstance) {
        scheduleCoroutine(DailyReminderTask(foxy),at(0, 0), foxy.tasksScope)
        scheduleCoroutine(CheckExpiredBansTask(foxy), at(0, 10), foxy.tasksScope)
        scheduleCoroutine(BirthdayReminderTask(foxy),at(0, 15), foxy.tasksScope)
        scheduleCoroutine(CakeInactivityTaxTask(foxy),at(0,30), foxy.tasksScope)
        scheduleCoroutine(UpdateStoreTask(foxy), at(21, 0), foxy.tasksScope)

        scheduleCoroutineAtFixedRate(
            taskName = UpvoteReminderTask::class.simpleName!!,
            scope = foxy.tasksScope,
            period = 2.hours,
            action = UpvoteReminderTask(foxy)
        )
        scheduleCoroutineAtFixedRate(
            taskName = CreateYouTubeWebhookTask::class.simpleName!!,
            scope = foxy.tasksScope,
            period = 3.hours,
            action = CreateYouTubeWebhookTask(foxy)
        )
        scheduleCoroutineAtFixedRate(
            taskName = PostTopggStatsTask::class.simpleName!!,
            scope = foxy.tasksScope,
            period = 3.hours,
            action = PostTopggStatsTask(foxy)
        )
    }

    private fun at(hour: Int, minute: Int) = LocalTime.of(hour, minute)
}