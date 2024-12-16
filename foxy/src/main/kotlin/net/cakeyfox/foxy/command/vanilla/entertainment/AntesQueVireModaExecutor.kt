package net.cakeyfox.foxy.command.vanilla.entertainment

import io.ktor.client.call.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload
import java.io.InputStream

private val supportedTypes = listOf(
    "image/png",
    "image/jpeg",
    "image/jpg"
)

private const val maxSize = 8_000_000 // 8MB

class AntesQueVireModaExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        context.defer()
        val attachment = context.event.getOption("image")!!.asAttachment

        if (attachment.width > 1920 || attachment.height > 1080) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["moda.imageTooBig"]
                )
            }

            return
        }

        if (attachment.size > maxSize) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["moda.fileTooBig"]
                )
            }

            return
        }

        if (attachment.contentType !in supportedTypes) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["moda.wrongContentType"]
                )
            }

            return
        }

        val response = context.instance.artistryClient.generateImage("memes/moda", buildJsonObject {
            put("asset", attachment.url)
        })

        if (response.status.value in 400..499) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["moda.fileNotSupported"]
                )
            }
            throw IllegalArgumentException("Unsupported image! Status code: ${response.status}")
        } else if (response.status.value !in 200..299) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["moda.unexpectedError", response.status.toString()]
                )
            }

            throw IllegalArgumentException("Error processing image! Status code: ${response.status}")
        }

        val image = response.body<InputStream>()

        context.reply {
            files.plusAssign(FileUpload.fromData(image.readBytes(), "moda.png"))
        }
    }
}