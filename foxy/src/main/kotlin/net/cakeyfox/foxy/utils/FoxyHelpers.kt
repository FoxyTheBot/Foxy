package net.cakeyfox.foxy.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.User

class FoxyHelpers(
    private val instance: FoxyInstance
) {
    suspend fun getMemberById(userId: String, guildId: String): Member {
        return instance.jda.getGuildById(guildId)?.getMemberById(userId)
            ?: withContext(Dispatchers.IO) {
                instance.jda.getGuildById(guildId)?.retrieveMemberById(userId)?.complete()
                    ?: throw IllegalArgumentException("Member not found")
            }
    }

    suspend fun getUserById(userId: String): User {
        return instance.jda.getUserById(userId)
            ?: withContext(Dispatchers.IO) {
                instance.jda.retrieveUserById(userId).complete()
                    ?: throw IllegalArgumentException("User not found")
            }
    }
}