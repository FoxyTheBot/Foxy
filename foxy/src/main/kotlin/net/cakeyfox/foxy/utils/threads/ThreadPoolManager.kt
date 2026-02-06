package net.cakeyfox.foxy.utils.threads

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.dv8tion.jda.api.events.Event
import net.dv8tion.jda.api.events.interaction.command.MessageContextInteractionEvent
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.interaction.command.UserContextInteractionEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.util.concurrent.ExecutorService

class ThreadPoolManager {
    private val coroutineMessageExecutor: ExecutorService = ThreadUtils.createThreadPool("MessageExecutor [%d]")
    private val coroutineMessageDispatcher = coroutineMessageExecutor.asCoroutineDispatcher()
    private val activeJobs = ThreadUtils.activeJobs
    private val coroutineScope = CoroutineScope(coroutineMessageDispatcher + SupervisorJob())

    fun launchMessageJob(event: Event, block: suspend CoroutineScope.() -> Unit) {
        val coroutineName = when (event) {
            is MessageReceivedEvent -> "Message ${event.message} by user ${event.author}"
            is SlashCommandInteractionEvent -> "Slash Command ${event.fullCommandName} by user ${event.user}"
            is MessageContextInteractionEvent -> "User Command ${event.fullCommandName} by user ${event.user}"
            is UserContextInteractionEvent -> "User Context ${event.fullCommandName} by user ${event.user}"
            else -> throw IllegalArgumentException("Event $event is not supported")
        }

        val start = System.currentTimeMillis()
        val job = coroutineScope.launch(
            coroutineMessageDispatcher + CoroutineName(coroutineName),
            block = block
        )

        activeJobs.add(job)
        job.invokeOnCompletion {
            activeJobs.remove(job)
            val end = System.currentTimeMillis()
            val time = end - start
            if (time > 10_000) {
                KotlinLogging.logger("MessageExecutor").warn { "Job $job took ${time}ms to complete" }
            }
        }
    }

    fun shutdown() {
        coroutineMessageExecutor.shutdown()
    }
}
