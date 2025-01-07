package net.cakeyfox.foxy.command.vanilla.entertainment.media

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.utils.FileUpload

class GirlfriendMemeExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val user = context.getOption<User>("user")

        val girlfriendImageBuffer = withContext(Dispatchers.IO) {
            context.foxy.artistryClient.generateImage("memes/girlfriend", buildJsonObject {
                put("avatar", user?.avatarUrl)
            })
        }

        if (girlfriendImageBuffer.status.value !in 200..299) {
            throw IllegalArgumentException("Error while generating image! Received ${girlfriendImageBuffer.status}")
        }

        val image = girlfriendImageBuffer.body<ByteReadChannel>().readRemaining().readByteArray()
        val imageAsFile = FileUpload.fromData(image, "girlfriend_${context.user.id}.png")

        context.reply {
            files.plusAssign(imageAsFile)
        }
    }
}