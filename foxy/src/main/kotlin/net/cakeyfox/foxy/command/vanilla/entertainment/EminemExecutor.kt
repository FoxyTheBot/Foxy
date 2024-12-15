package net.cakeyfox.foxy.command.vanilla.entertainment

import io.ktor.client.call.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload
import java.io.InputStream

class EminemExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        context.event.deferReply().queue()
        val attachment = context.event.getOption("video_or_audio")!!.asAttachment

        if (attachment.size > FileRequirements.maxSize) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["8mile.fileTooBig"]
                    )
            }
            return
        }

        if (attachment.contentType !in FileRequirements.supportedTypes) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["8mile.wrongContentType"]
                )
            }
            return
        }


        val response = context.instance.artistryClient.generateImage("memes/8mile", buildJsonObject {
            put("url", attachment.url)
            put("contentType", attachment.contentType)
            put("size", attachment.size)
        })

        if (response.status.value in 400..499) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["8mile.fileNotSupported"]
                )
            }
            throw IllegalArgumentException("Unsupported image! Status code: ${response.status}")
        } else if (response.status.value !in 200..299) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["8mile.unexpectedError", response.status.toString()]
                )
            }

            throw IllegalArgumentException("Error processing image! Status code: ${response.status}")
        }

        val video = response.body<InputStream>()
        val file = FileUpload.fromData(video.readBytes(), "8mile.mp4")

        context.reply {
            files.plusAssign(file)
        }

        return
    }
}


object FileRequirements {
    val supportedTypes = listOf(
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

    val maxSize = 8_000_000 // 8MB
}