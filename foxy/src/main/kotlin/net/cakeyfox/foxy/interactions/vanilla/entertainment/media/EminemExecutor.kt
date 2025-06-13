package net.cakeyfox.foxy.interactions.vanilla.entertainment.media

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.utils.FileUpload

private val supportedTypes = listOf(
    "audio/mpeg",
    "audio/wav",
    "audio/aac",
    "audio/ogg",
    "audio/flac",
    "audio/opus",
    "audio/x-m4a",
    "video/mp4",
    "video/x-msvideo",
    "video/x-matroska",
    "video/ogg",
    "video/x-flv"
)

private const val maxSize = 8_000_000 // 8MB


class EminemExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val attachment = context.getOption<Message.Attachment>("video_or_audio")!!

        if (attachment.size > maxSize) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["8mile.fileTooBig"]
                )
            }
            return
        }

        if (attachment.contentType !in supportedTypes) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["8mile.wrongContentType"]
                )
            }
            return
        }


        val response = withContext(context.foxy.coroutineDispatcher) {
            context.foxy.artistryClient.generateImage("memes/8mile", buildJsonObject {
                put("url", attachment.url)
                put("contentType", attachment.contentType)
                put("size", attachment.size)
            })
        }

        if (response.status.value in 400..499) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["8mile.fileNotSupported"]
                )
            }
            return
        } else if (response.status.value !in 200..299) {
            throw IllegalArgumentException("Error processing video! Status code: ${response.status}")
        }

        val video = response.body<ByteReadChannel>().readRemaining().readByteArray()
        val file = FileUpload.fromData(video, "8mile_${context.user.id}.mp4")

        context.reply {
            files.plusAssign(file)
        }
    }
}