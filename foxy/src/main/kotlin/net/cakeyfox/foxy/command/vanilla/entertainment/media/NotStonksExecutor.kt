package net.cakeyfox.foxy.command.vanilla.entertainment.media

import io.ktor.client.call.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload
import java.io.InputStream

class NotStonksExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val text = context.getOption<String>("text")!!

        val notStonksImage = context.instance.artistryClient.generateImage("memes/notstonks", buildJsonObject {
            put("text", text)
        })

        if (notStonksImage.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${notStonksImage.status}")
        }

        val response = notStonksImage.body<InputStream>()
        val imageAsFile = FileUpload.fromData(response, "not_stonks.png")

        context.reply {
            files.plusAssign(imageAsFile)
        }
    }
}