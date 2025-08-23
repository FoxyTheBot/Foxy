package net.cakeyfox.foxy.interactions.vanilla.magic

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.utils.FileUpload

class GostosIguaisExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()

        val attachment1 = context.getOption("first_image", 0, Message.Attachment::class.java) ?: return handleInvalidAttachment(context)
        val attachment2 = context.getOption("second_image", 0, Message.Attachment::class.java) ?: return handleInvalidAttachment(context)
        val text = context.getOption("text", 0, String::class.java) ?: "Não, não somos iguais"
        val maxDimension = 4096

        if (!attachment1.isImage || !attachment2.isImage) {
            return replyNotImages(context)
        }

        if (attachment1.width > maxDimension || attachment1.height > maxDimension ||
            attachment2.width > maxDimension || attachment2.height > maxDimension) {
            return replyFileTooBig(context)
        }

        val image = withContext(context.foxy.coroutineDispatcher) {
            context.foxy.showtimeClient.generateImage(Constants.GOSTOS_IGUAIS_ROUTE, buildJsonObject {
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

    private suspend fun handleInvalidAttachment(context: CommandContext) {
        context.reply {
            content = pretty(
                FoxyEmotes.FoxyCry,
                context.locale["gostosiguais.invalidAttachment"]
            )
        }
    }

    private suspend fun replyNotImages(context: CommandContext) {
        context.reply {
            content = pretty(
                FoxyEmotes.FoxyCry,
                context.locale["gostosiguais.notImages"]
            )
        }
    }

    private suspend fun replyFileTooBig(context: CommandContext) {
        context.reply {
            content = pretty(
                FoxyEmotes.FoxyCry,
                context.locale["gostosiguais.fileTooBig"]
            )
        }
    }
}