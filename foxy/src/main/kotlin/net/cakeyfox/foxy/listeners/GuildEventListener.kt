package net.cakeyfox.foxy.listeners

import net.cakeyfox.foxy.FoxyInstance
import net.dv8tion.jda.api.events.guild.GenericGuildEvent
import net.dv8tion.jda.api.events.guild.GuildJoinEvent
import net.dv8tion.jda.api.events.guild.GuildLeaveEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter

class GuildEventListener(private val instance: FoxyInstance): ListenerAdapter() {
    // TODO: Implement listeners for 'GUILD_MEMBER_ADD' and 'GUILD_MEMBER_REMOVE' events to support the welcomer module

    override fun onGenericGuild(event: GenericGuildEvent) {
        when (event) {
            is GuildJoinEvent -> {
                println("Joined guild ${event.guild.name}")
                // TODO: Handle new guilds (add to database)
            }

            is GuildLeaveEvent -> {
                println("Left guild ${event.guild.name}")
                // TODO: Create a logic to delete guilds from database if removed
            }
        }
    }
}