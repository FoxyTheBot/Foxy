package net.cakeyfox.foxy.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.User

class FoxyHelpers(
    private val instance: FoxyInstance
) {
    suspend fun getMemberById(userId: String, guildId: String): Member? {
        val guild = instance.jda.getGuildById(guildId) ?: return null

        return guild.getMemberById(userId) ?: withContext(Dispatchers.IO) {
            try {
                guild.retrieveMemberById(userId).complete()
            } catch (e: Exception) {
                null
            }
        }
    }

    suspend fun getUserById(userId: String): User {
        return instance.jda.getUserById(userId) ?: withContext(Dispatchers.IO) {
            try {
                instance.jda.retrieveUserById(userId).complete()
            } catch (e: Exception) {
                throw IllegalArgumentException("User not found", e)
            }
        }
    }
}