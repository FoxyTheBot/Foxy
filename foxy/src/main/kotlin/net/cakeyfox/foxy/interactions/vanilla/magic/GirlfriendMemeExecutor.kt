package net.cakeyfox.foxy.interactions.vanilla.magic

import io.ktor.client.call.*
import io.ktor.utils.io.*
import kotlinx.coroutines.withContext
import kotlinx.io.readByteArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.utils.FileUpload

class GirlfriendMemeExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val user = context.getOption("user", 0, User::class.java) ?: return
        val girlfriendImageBuffer = withContext(context.foxy.coroutineDispatcher) {
            context.foxy.showtimeClient.generateImage(Constants.GIRLFRIEND_ROUTE, buildJsonObject {
                put("avatar", user.avatarUrl)
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