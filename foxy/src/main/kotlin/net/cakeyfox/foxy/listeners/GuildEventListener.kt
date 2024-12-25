package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.antiraid.AntiRaidSystem
import net.cakeyfox.foxy.modules.welcomer.WelcomerManager
import net.dv8tion.jda.api.events.guild.GenericGuildEvent
import net.dv8tion.jda.api.events.guild.GuildJoinEvent
import net.dv8tion.jda.api.events.guild.GuildLeaveEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class GuildEventListener(private val foxy: FoxyInstance): ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val welcomer = WelcomerManager(foxy)
    private val antiRaid = AntiRaidSystem(foxy)
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    override fun onGenericGuild(event: GenericGuildEvent) {
        coroutineScope.launch {
            when (event) {
                is GuildJoinEvent -> {
                    foxy.mongoClient.utils.guild.getGuild(event.guild.id)
                    logger.info { "Joined guild ${event.guild.name}" }
                }

                is GuildLeaveEvent -> {
                    foxy.mongoClient.utils.guild.deleteGuild(event.guild.id)
                    logger.info { "Left guild ${event.guild.name}" }
                }

                is GuildMemberJoinEvent -> {
                    welcomer.onGuildJoin(event)
                    antiRaid.handleJoin(event)
                }

                is GuildMemberRemoveEvent -> {
                    welcomer.onGuildLeave(event)
                }
            }
        }
    }
}