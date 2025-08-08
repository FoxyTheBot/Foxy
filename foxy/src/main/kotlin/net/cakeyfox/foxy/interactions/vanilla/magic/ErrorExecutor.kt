package net.cakeyfox.foxy.interactions.vanilla.magic

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.utils.FileUpload

class ErrorExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()

        val text = context.getOption("message", 0, String::class.java)

        if (text == null || text.isEmpty()) return
        if (text.length > 100) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["error.tooLong"]
                )
            }
        }

        val errorImage = withContext(context.foxy.coroutineDispatcher) {
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