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
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.utils.FileUpload

private val supportedTypes = listOf(
    "image/png",
    "image/jpeg",
    "image/jpg"
)

private const val maxSize = 8_000_000 // 8MB


class AntesQueVireModaExecutor: FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val attachment = context.getOption<Message.Attachment>("image")!!

        if (attachment.width > 1920 || attachment.height > 1080) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["moda.imageTooBig"]
                )
            }

            return
        }

        if (attachment.size > maxSize) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["moda.fileTooBig"]
                )
            }

            return
        }

        if (attachment.contentType !in supportedTypes) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["moda.wrongContentType"]
                )
            }

            return
        }

        val response = withContext(Dispatchers.IO) {
            context.foxy.artistryClient.generateImage("memes/moda", buildJsonObject {
                put("asset", attachment.url)
            })
        }

        if (response.status.value in 400..499) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["moda.fileNotSupported"]
                )
            }
            return
        } else if (response.status.value !in 200..299) {
            throw IllegalArgumentException("Error processing image! Status code: ${response.status}")
        }

        val image = response.body<ByteReadChannel>().readRemaining().readByteArray()

        context.reply {
            files.plusAssign(FileUpload.fromData(image, "moda.png"))
        }
    }
}