package net.cakeyfox.foxy.modules.welcomer.utils

import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent

interface WelcomerWrapper {
    suspend fun onGuildJoin(event: GuildMemberJoinEvent)
    suspend fun onGuildLeave(event: GuildMemberRemoveEvent)
}