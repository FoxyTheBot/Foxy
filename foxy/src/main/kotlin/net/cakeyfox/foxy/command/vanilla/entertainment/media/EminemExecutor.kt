package net.cakeyfox.foxy.command.vanilla.entertainment.media

import io.ktor.client.call.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.utils.FileUpload
import java.io.InputStream

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


class EminemExecutor: FoxyCommandExecutor() {
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


        val response = context.foxy.artistryClient.generateImage("memes/8mile", buildJsonObject {
            put("url", attachment.url)
            put("contentType", attachment.contentType)
            put("size", attachment.size)
        })

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

        val video = response.body<InputStream>()
        val file = FileUpload.fromData(video, "8mile_${context.user.id}.mp4")

        context.reply {
            files.plusAssign(file)
        }
    }
}