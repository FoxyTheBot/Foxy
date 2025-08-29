package net.cakeyfox.foxy.modules.autorole

import kotlinx.coroutines.delay
import kotlinx.coroutines.suspendCancellableCoroutine
import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.Role
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.Permission
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

class AutoRoleModule(
    val foxy: FoxyInstance
) {
    suspend fun handleUser(event: GuildMemberJoinEvent) {
        if (!event.guild.selfMember.hasPermission(Permission.MANAGE_ROLES)) return

        val guildData = foxy.database.guild.getGuild(event.guild.id)
        val member = event.member

        if (guildData.AutoRoleModule != null) {
            if (guildData.AutoRoleModule!!.isEnabled) {
                val roleIds = guildData.AutoRoleModule!!.roles

                val rolesToGive = roleIds.mapNotNull { event.guild.getRoleById(it) }
                    .filter { canAssignRole(event.guild, it) }

                rolesToGive.take(5).forEach { role ->
                    assignRoleAsync(event.guild, member, role)
                    delay(200)
                }
            }
        }
    }

    private fun canAssignRole(guild: Guild, role: Role): Boolean {
        val topBotRole = guild.selfMember.roles.maxByOrNull { it.position }?.position ?: 0
        return topBotRole > role.position
    }

    private suspend fun assignRoleAsync(
        guild: Guild,
        member: Member,
        role: Role
    ) {
        suspendCancellableCoroutine { continuation ->
            guild.addRoleToMember(member, role).queue(
                { continuation.resume(Unit) },
                { error -> continuation.resumeWithException(error) }
            )
        }
    }
}
