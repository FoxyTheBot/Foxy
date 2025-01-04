package net.cakeyfox.foxy.modules.autorole

import kotlinx.coroutines.suspendCancellableCoroutine
import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.entities.Role
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

class AutoRoleModule(
    val foxy: FoxyInstance
) {

    suspend fun handleUser(event: GuildMemberJoinEvent) {
        if (!event.guild.selfMember.hasPermission(Permission.MANAGE_ROLES)) return

        val guildData = foxy.mongoClient.utils.guild.getGuild(event.guild.id)
        val member = event.member

        if (guildData.AutoRoleModule.isEnabled) {
            val roleIds = guildData.AutoRoleModule.roles

            val rolesToGive = roleIds.mapNotNull { event.guild.getRoleById(it) }
                .filter { canAssignRole(event.guild, it) }

            rolesToGive.take(5).forEach { role ->
                assignRoleAsync(event.guild, member, role)
            }
        }
    }

    private fun canAssignRole(guild: Guild, role: Role): Boolean {
        val bot = guild.selfMember
        return bot.hasPermission(Permission.MANAGE_ROLES) && (bot.roles.maxByOrNull { it.position }?.position
            ?: 0) > role.position
    }

    private suspend fun assignRoleAsync(guild: Guild, member: net.dv8tion.jda.api.entities.Member, role: Role) {
        suspendCancellableCoroutine { continuation ->
            guild.addRoleToMember(member, role).queue(
                {
                    continuation.resume(Unit)
                },
                { error ->
                    continuation.resumeWithException(error)
                }
            )
        }
    }
}