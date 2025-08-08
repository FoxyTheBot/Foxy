package net.cakeyfox.foxy.interactions.vanilla.magic

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload

class LaranjoExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val text = context.getOption("text", 0, String::class.java, true)

        val laranjoImage = withContext(context.foxy.coroutineDispatcher) {
            context.foxy.artistryClient.generateImage("memes/laranjo", buildJsonObject {
                put("text", text)
            })
        }

        if (laranjoImage.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${laranjoImage.status}")
        }

        val image = laranjoImage.body<ByteReadChannel>().readRemaining().readByteArray()
        val file = FileUpload.fromData(image, "laranjo_${context.user.id}.png")

        context.reply {
            files.plusAssign(file)
        }
    }
}