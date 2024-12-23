package net.cakeyfox.foxy.command.vanilla.entertainment.media

import io.ktor.client.call.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.utils.FileUpload
import java.io.InputStream

class LaranjoExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val text = context.getOption<String>("text")!!

        val laranjoImage = context.instance.artistryClient.generateImage("memes/laranjo", buildJsonObject {
            put("text", text)
        })

        if (laranjoImage.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${laranjoImage.status}")
        }

        val image = laranjoImage.body<InputStream>()
        val file = FileUpload.fromData(image, "laranjo_${context.user.id}.png")

        context.reply {
            files.plusAssign(file)
        }
    }
}