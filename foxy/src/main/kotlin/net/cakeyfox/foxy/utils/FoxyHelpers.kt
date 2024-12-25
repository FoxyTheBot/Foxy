package net.cakeyfox.foxy.utils

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.User

class FoxyHelpers(
    private val foxy: FoxyInstance
) {
    suspend fun getMemberById(userId: String, guildId: String): Member? {
        val guild = foxy.jda.getGuildById(guildId) ?: return null

        return guild.getMemberById(userId) ?: withContext(Dispatchers.IO) {
            try {
                guild.retrieveMemberById(userId).await()
            } catch (e: Exception) {
                null
            }
        }
    }

    suspend fun getUserById(userId: String): User {
        return foxy.jda.getUserById(userId) ?: withContext(Dispatchers.IO) {
            try {
                foxy.jda.retrieveUserById(userId).await()
            } catch (e: Exception) {
                throw IllegalArgumentException("User not found", e)
            }
        }
    }
}