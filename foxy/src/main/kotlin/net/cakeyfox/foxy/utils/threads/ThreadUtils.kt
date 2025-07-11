package net.cakeyfox.foxy.utils.threads

import com.google.common.util.concurrent.ThreadFactoryBuilder
import kotlinx.coroutines.Job
import net.cakeyfox.foxy.FoxyLauncher
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

object ThreadUtils {
    fun createThreadPool(name: String): ExecutorService {
        val classLoader = FoxyLauncher::class.java.classLoader

        val threadFactory = ThreadFactoryBuilder().setNameFormat(name).setThreadFactory { runnable ->
            val thread = Thread(runnable)
            thread.contextClassLoader = classLoader
            thread
        }.build()

        return Executors.newCachedThreadPool(threadFactory)
    }

    val activeJobs = ConcurrentLinkedQueue<Job>()
}