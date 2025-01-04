package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.antiraid.AntiRaidModule
import net.cakeyfox.foxy.modules.autorole.AutoRoleModule
import net.cakeyfox.foxy.modules.welcomer.WelcomerModule
import net.dv8tion.jda.api.events.guild.GenericGuildEvent
import net.dv8tion.jda.api.events.guild.GuildJoinEvent
import net.dv8tion.jda.api.events.guild.GuildLeaveEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class GuildEventListener(private val foxy: FoxyInstance) : ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val welcomer = WelcomerModule(foxy)
    private val antiRaid = AntiRaidModule(foxy)
    private val autoRole = AutoRoleModule(foxy)
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    override fun onGenericGuild(event: GenericGuildEvent) {
        coroutineScope.launch {
            when (event) {
                is GuildJoinEvent -> {
                    foxy.mongoClient.utils.guild.getGuild(event.guild.id)
                    logger.info { "Joined guild ${event.guild.name} - ${event.guild.id}" }
                }

                is GuildLeaveEvent -> {
                    foxy.mongoClient.utils.guild.deleteGuild(event.guild.id)
                    logger.info { "Left guild ${event.guild.name} - ${event.guild.id}" }
                }

                is GuildMemberJoinEvent -> {
                    welcomer.onGuildJoin(event)
                    antiRaid.handleJoin(event)
                    autoRole.handleUser(event)
                }

                is GuildMemberRemoveEvent -> {
                    welcomer.onGuildLeave(event)
                }
            }
        }
    }
}