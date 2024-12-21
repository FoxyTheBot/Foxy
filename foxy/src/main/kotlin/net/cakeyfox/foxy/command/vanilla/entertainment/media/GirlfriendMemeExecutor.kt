package net.cakeyfox.foxy.command.vanilla.entertainment.media

import io.ktor.client.call.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.utils.FileUpload
import java.io.InputStream

class GirlfriendMemeExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val user = context.getOption<User>("user")

        val girlfriendImageBuffer = context.instance.artistryClient.generateImage("memes/girlfriend", buildJsonObject {
            put("avatar", user?.avatarUrl)
        })

        if (girlfriendImageBuffer.status.value !in 200..299) {
            context.reply {
                content = context.prettyResponse {
                    content = context.locale["error.errorWhileGenerating"]
                }
            }

            throw IllegalArgumentException("Error while generating image! Received ${girlfriendImageBuffer.status}")
            return
        }

        val image = girlfriendImageBuffer.body<InputStream>()
        val imageAsFile = FileUpload.fromData(image.readBytes(), "girlfriend_${context.user.id}.png")

        context.reply {
            files.plusAssign(imageAsFile)
        }
    }
}