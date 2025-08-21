package net.cakeyfox.foxy.interactions.vanilla.magic

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload

class NotStonksExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val text = context.getOption("text", 0, String::class.java, true)

        val notStonksImage = withContext(context.foxy.coroutineDispatcher) {
            context.foxy.showtimeClient.generateImage("memes/notstonks", buildJsonObject {
                put("text", text)
            })
        }

        if (notStonksImage.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${notStonksImage.status}")
        }

        val response = notStonksImage.body<ByteReadChannel>().readRemaining().readByteArray()
        val imageAsFile = FileUpload.fromData(response, "not_stonks.png")

        context.reply {
            files.plusAssign(imageAsFile)
        }
    }
}