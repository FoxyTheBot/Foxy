package net.cakeyfox.foxy.threads

import com.google.common.util.concurrent.ThreadFactoryBuilder
import kotlinx.coroutines.Job
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

object ThreadUtils {
    fun createThreadPool(name: String): ExecutorService =
        Executors.newCachedThreadPool(ThreadFactoryBuilder().setNameFormat(name).build())

    val activeJobs = ConcurrentLinkedQueue<Job>()
}