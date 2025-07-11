package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.autorole.AutoRoleModule
import net.cakeyfox.foxy.modules.welcomer.WelcomerModule
import net.dv8tion.jda.api.events.guild.GuildJoinEvent
import net.dv8tion.jda.api.events.guild.GuildLeaveEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class GuildListener(private val foxy: FoxyInstance) : ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val welcomer = WelcomerModule(foxy)
    private val autoRole = AutoRoleModule(foxy)
    private val coroutineScope = CoroutineScope(foxy.coroutineDispatcher + SupervisorJob())

    override fun onGuildJoin(event: GuildJoinEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            foxy.database.guild.getGuild(event.guild.id)
            logger.info { "Joined guild ${event.guild.name} - ${event.guild.id}" }
        }
    }

    override fun onGuildLeave(event: GuildLeaveEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            foxy.database.guild.deleteGuild(event.guild.id)
            logger.info { "Left guild ${event.guild.name} - ${event.guild.id}" }
        }
    }

    override fun onGuildMemberJoin(event: GuildMemberJoinEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            welcomer.onGuildJoin(event)
            autoRole.handleUser(event)
        }
    }

    override fun onGuildMemberRemove(event: GuildMemberRemoveEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            welcomer.onGuildLeave(event)
        }
    }
}