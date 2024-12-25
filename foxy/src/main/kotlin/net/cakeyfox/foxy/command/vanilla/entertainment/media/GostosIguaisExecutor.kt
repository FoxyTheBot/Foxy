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

class GostosIguaisExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val attachment1 = context.getOption<Message.Attachment>("first_image") ?: return handleInvalidAttachment(context)
        val attachment2 = context.getOption<Message.Attachment>("second_image") ?: return handleInvalidAttachment(context)
        val text = context.getOption<String>("text") ?: "Não, não somos iguais"
        val maxDimension = 4096

        if (!attachment1.isImage || !attachment2.isImage) {
            return replyNotImages(context)
        }

        if (attachment1.width > maxDimension || attachment1.height > maxDimension ||
            attachment2.width > maxDimension || attachment2.height > maxDimension) {
            return replyFileTooBig(context)
        }

        val image = context.foxy.artistryClient.generateImage("memes/gosto", buildJsonObject {
            put("asset1", attachment1.url)
            put("asset2", attachment2.url)
            put("text", text)
        })

        if (image.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${image.status}")
        }

        val imageBuffer = image.body<InputStream>()
        val imageAsFile = FileUpload.fromData(imageBuffer, "naosomosiguais.png")

        context.reply {
            files.plusAssign(imageAsFile)
        }
    }

    private suspend fun handleInvalidAttachment(context: FoxyInteractionContext) {
        context.reply {
            content = pretty(
                FoxyEmotes.FoxyCry,
                context.locale["gostosiguais.invalidAttachment"]
            )
        }
    }

    private suspend fun replyNotImages(context: FoxyInteractionContext) {
        context.reply {
            content = pretty(
                FoxyEmotes.FoxyCry,
                context.locale["gostosiguais.notImages"]
            )
        }
    }

    private suspend fun replyFileTooBig(context: FoxyInteractionContext) {
        context.reply {
            content = pretty(
                FoxyEmotes.FoxyCry,
                context.locale["gostosiguais.fileTooBig"]
            )
        }
    }
}