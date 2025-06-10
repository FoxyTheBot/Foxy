package net.cakeyfox.foxy.threads

import com.google.common.util.concurrent.ThreadFactoryBuilder
import kotlinx.coroutines.Job
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

object ThreadUtils {
    fun createThreadPool(name: String): ExecutorService {
        val classLoader = Thread.currentThread().contextClassLoader

        val threadFactory = ThreadFactoryBuilder().setNameFormat(name).setThreadFactory { runnable ->
            val thread = Thread(runnable)
            thread.contextClassLoader = classLoader
            thread
        }.build()

        return Executors.newCachedThreadPool(threadFactory)
    }

    val activeJobs = ConcurrentLinkedQueue<Job>()
}