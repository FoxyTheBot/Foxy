package net.cakeyfox.foxy.command.vanilla.entertainment.media

import io.ktor.client.call.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload
import java.io.InputStream

class ErrorExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val text = context.getOption<String>("message")!!

        if (text.length > 100) {
            context.reply {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FoxyCry
                    content = context.locale["error.tooLong"]
                }
            }
        }

        val errorImage = context.instance.artistryClient.generateImage("memes/windowserror", buildJsonObject {
            put("text", text)
        })

        if (errorImage.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${errorImage.status}")
        }

        val image = errorImage.body<InputStream>()
        val file = FileUpload.fromData(image, "error_${context.user.id}.png")

        context.reply {
            files.plusAssign(file)
        }
    }
}