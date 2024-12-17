package net.cakeyfox.foxy.listeners

import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.welcomer.WelcomerManager
import net.dv8tion.jda.api.events.guild.GenericGuildEvent
import net.dv8tion.jda.api.events.guild.GuildJoinEvent
import net.dv8tion.jda.api.events.guild.GuildLeaveEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class GuildEventListener(private val instance: FoxyInstance): ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val welcomer = WelcomerManager(instance)

    override fun onGenericGuild(event: GenericGuildEvent) {
        when (event) {
            is GuildJoinEvent -> {
                instance.mongoClient.guildUtils.getGuild(event.guild.id)
                logger.info { "Joined guild ${event.guild.name}" }
            }

            is GuildLeaveEvent -> {
                instance.mongoClient.guildUtils.deleteGuild(event.guild.id)
                logger.info { "Left guild ${event.guild.name}" }
            }

            is GuildMemberJoinEvent -> {
                welcomer.onGuildJoin(event)
            }

            is GuildMemberRemoveEvent -> {
                welcomer.onGuildLeave(event)
            }
        }
    }
}