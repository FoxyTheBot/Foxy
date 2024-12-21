package net.cakeyfox.foxy.welcomer.utils

import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent

interface WelcomerWrapper {
    fun onGuildJoin(event: GuildMemberJoinEvent)
    fun onGuildLeave(event: GuildMemberRemoveEvent)
}