package net.cakeyfox.foxy.utils.threads

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.utils.SonhosTransactionChecker
import net.cakeyfox.serializable.loritta.SonhosRequestResponse
import net.dv8tion.jda.api.events.Event
import net.dv8tion.jda.api.events.interaction.command.MessageContextInteractionEvent
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.util.concurrent.ExecutorService

class ThreadPoolManager {
    private val coroutineMessageExecutor: ExecutorService = ThreadUtils.createThreadPool("MessageExecutor [%d]")
    private val coroutineSonhosTransactionCheck = ThreadUtils.createThreadPool("SonhosTransactionCheck [%d]")
    private val coroutineSonhosTransactionCheckDispatcher = coroutineSonhosTransactionCheck.asCoroutineDispatcher()
    private val coroutineMessageDispatcher = coroutineMessageExecutor.asCoroutineDispatcher()
    private val activeJobs = ThreadUtils.activeJobs
    private val coroutineScope = CoroutineScope(coroutineMessageDispatcher + SupervisorJob())

    fun launchMessageJob(event: Event, block: suspend CoroutineScope.() -> Unit) {
        val coroutineName = when (event) {
            is MessageReceivedEvent -> "Message ${event.message} by user ${event.author}"
            is SlashCommandInteractionEvent -> "Slash Command ${event.fullCommandName} by user ${event.user}"
            is MessageContextInteractionEvent -> "User Command ${event.fullCommandName} by user ${event.user}"
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

    fun launchSonhosTransactionCheckJob(response: SonhosRequestResponse, context: FoxyInteractionContext) {
        val coroutineName = "Sonhos Transaction Check ${response.sonhosTransferRequestId}"

        val start = System.currentTimeMillis()
        val job = coroutineScope.launch(
            coroutineSonhosTransactionCheckDispatcher + CoroutineName(coroutineName)
        ) {
            SonhosTransactionChecker(response, context).execute()
        }

        activeJobs.add(job)

        job.invokeOnCompletion {
            activeJobs.remove(job)
            val end = System.currentTimeMillis()
            val time = end - start
            if (time > 70_000) {
                KotlinLogging.logger("SonhosTransactionCheck").warn { "Job $job took ${time}ms to complete" }
            }
        }
    }
}
