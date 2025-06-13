package net.cakeyfox.foxy.interactions.vanilla.entertainment.media

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.Dispatchers
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

class GostosIguaisExecutor : FoxySlashCommandExecutor() {
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

        val image = withContext(context.foxy.coroutineDispatcher) {
            context.foxy.artistryClient.generateImage("memes/gosto", buildJsonObject {
                put("asset1", attachment1.url)
                put("asset2", attachment2.url)
                put("text", text)
            })
        }

        if (image.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${image.status}")
        }

        val imageBuffer = image.body<ByteReadChannel>().readRemaining().readByteArray()
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