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

class StonksExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val text = context.getOption("text", 0, String::class.java, true)

        val stonksImage = withContext(context.foxy.coroutineDispatcher) {
            context.foxy.artistryClient.generateImage("memes/stonks", buildJsonObject {
                put("text", text)
            })
        }

        if (stonksImage.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${stonksImage.status}")
        }

        val response = stonksImage.body<ByteReadChannel>().readRemaining().readByteArray()
        val imageAsFile = FileUpload.fromData(response, "stonks.png")

        context.reply {
            files.plusAssign(imageAsFile)
        }
    }
}