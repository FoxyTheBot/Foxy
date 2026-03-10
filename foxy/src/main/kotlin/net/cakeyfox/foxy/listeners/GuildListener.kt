package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.AutoRoleModule
import net.cakeyfox.foxy.modules.ServerLogModule
import net.cakeyfox.foxy.modules.WelcomerModule
import net.cakeyfox.foxy.utils.AdminUtils.buildBanUserMessageJson
import net.cakeyfox.foxy.utils.PlaceholderUtils.getModerationPlaceholders
import net.cakeyfox.foxy.utils.discord.DiscordMessageUtils.getMessageFromJson
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.entities.channel.ChannelType
import net.dv8tion.jda.api.events.guild.GuildBanEvent
import net.dv8tion.jda.api.events.guild.GuildJoinEvent
import net.dv8tion.jda.api.events.guild.GuildLeaveEvent
import net.dv8tion.jda.api.events.guild.GuildUnbanEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent
import net.dv8tion.jda.api.events.guild.voice.GuildVoiceUpdateEvent
import net.dv8tion.jda.api.events.session.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import kotlin.reflect.jvm.jvmName

class GuildListener(private val foxy: FoxyInstance) : ListenerAdapter() {
    private val logger = KotlinLogging.logger(this::class.jvmName)
    private val welcomer = WelcomerModule(foxy)
    private val autoRole = AutoRoleModule(foxy)
    private val coroutineScope = CoroutineScope(foxy.coroutineDispatcher + SupervisorJob())
    private val serverLogModule = ServerLogModule(foxy)

    override fun onGuildUnban(event: GuildUnbanEvent) {
        coroutineScope.launch {
            val guildData = foxy.database.guild.getGuild(event.guild.id)
            val isTempBanned = guildData.tempBans?.any { it.userId == event.user.id } == true

            if (isTempBanned) {
                foxy.database.guild.removeTempBanFromGuild(event.guild.id, event.user.id)
            }
        }
    }

    override fun onReady(event: ReadyEvent) {
        coroutineScope.launch {
            event.jda.presence.activity = Activity.customStatus(
                Constants.getDefaultActivity(
                    foxy.database.bot.getActivity(),
                    foxy.config.environment,
                    foxy.currentCluster.id,
                    event.jda.shardManager?.shards?.size ?: 1
                )
            )
        }
    }

    override fun onGuildJoin(event: GuildJoinEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            foxy.database.guild.getGuild(event.guild.id)
            logger.info { "Joined guild ${event.guild.name} (${event.guild.id}) - ${event.guild.memberCount} members" }
        }
    }

    override fun onGuildLeave(event: GuildLeaveEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            foxy.database.guild.deleteGuild(event.guild.id)
            logger.info { "Left guild ${event.guild.name} (${event.guild.id}) - ${event.guild.memberCount} members" }
        }
    }

    override fun onGuildVoiceUpdate(event: GuildVoiceUpdateEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            serverLogModule.processGuildVoiceUpdate(event)
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