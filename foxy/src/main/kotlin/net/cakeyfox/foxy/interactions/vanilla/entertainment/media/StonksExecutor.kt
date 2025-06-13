package net.cakeyfox.foxy.interactions.vanilla.entertainment.media

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload

class StonksExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val text = context.getOption<String>("text")!!

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