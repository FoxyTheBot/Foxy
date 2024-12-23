package net.cakeyfox.foxy.command.vanilla.entertainment.media

import io.ktor.client.call.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload
import java.io.InputStream

class StonksExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val text = context.getOption<String>("text")!!

        val stonksImage = context.instance.artistryClient.generateImage("memes/stonks", buildJsonObject {
            put("text", text)
        })

        if (stonksImage.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${stonksImage.status}")
        }

        val response = stonksImage.body<InputStream>()
        val imageAsFile = FileUpload.fromData(response, "stonks.png")

        context.reply {
            files.plusAssign(imageAsFile)
        }
    }
}