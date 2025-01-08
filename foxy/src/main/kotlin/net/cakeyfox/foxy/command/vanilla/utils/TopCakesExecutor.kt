package net.cakeyfox.foxy.command.vanilla.utils

import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.serializable.database.data.FoxyUser
import okhttp3.Cache

class TopCakesExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val users = context.db.utils.user.getAllUsers()
        val sorted = users.sortedByDescending { it.userCakes.balance }

        val topUsers = sorted.take(15)
        val topUsersWithName = topUsers.mapIndexed { index, user ->
            val rank = index + 1
            val userInfo = context.jda.retrieveUserById(user._id).await()
            val username = userInfo.globalName ?: userInfo.name
            val cakes = context.utils.formatLongNumber(user.userCakes.balance.toLong(), "pt", "BR")
            Triple(rank, username, cakes)
        }

        context.reply {
            embed {
                title = context.locale["top.cakes.embed.title"]
                color = Colors.FOXY_DEFAULT
                thumbnail = context.jda.getEmojiById(FoxyEmotes.FoxyDaily)?.imageUrl
                topUsersWithName.forEach { (rank, username, cakes) ->
                    field {
                        name = "$rank. $username"
                        value = "**$cakes** Cakes"
                        inline = true
                    }
                }
            }
        }
    }
}