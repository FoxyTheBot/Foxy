package net.cakeyfox.foxy.command.vanilla.entertainment.media

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.utils.FileUpload

class ErrorExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val text = context.getOption<String>("message")!!

        if (text.length > 100) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["error.tooLong"]
                )
            }
        }

        val errorImage = withContext(Dispatchers.IO) {
            context.foxy.artistryClient.generateImage("memes/windowserror", buildJsonObject {
                put("text", text)
            })
        }

        if (errorImage.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${errorImage.status}")
        }

        val image = errorImage.body<ByteReadChannel>().readRemaining().readByteArray()
        val file = FileUpload.fromData(image, "error_${context.user.id}.png")

        context.reply {
            files.plusAssign(file)
        }
    }
}