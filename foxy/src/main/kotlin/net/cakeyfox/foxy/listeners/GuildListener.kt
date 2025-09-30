package net.cakeyfox.foxy.listeners

import kotlinx.coroutines.*
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.modules.autorole.AutoRoleModule
import net.cakeyfox.foxy.modules.welcomer.WelcomerModule
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.entities.channel.ChannelType
import net.dv8tion.jda.api.events.guild.GuildJoinEvent
import net.dv8tion.jda.api.events.guild.GuildLeaveEvent
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
            logger.info { "Joined guild ${event.guild.name} - ${event.guild.id}" }
        }
    }

    override fun onGuildLeave(event: GuildLeaveEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            foxy.database.guild.deleteGuild(event.guild.id)
            logger.info { "Left guild ${event.guild.name} - ${event.guild.id}" }
        }
    }

    override fun onGuildVoiceUpdate(event: GuildVoiceUpdateEvent) {
        coroutineScope.launch(foxy.coroutineDispatcher) {
            val isFoxyConnected = event.guild.selfMember.voiceState?.inAudioChannel() == true
            val guild = foxy.database.guild.getGuild(event.guild.id)
            val voiceChannel = event.guild.selfMember.voiceState?.channel ?: return@launch

            if (isFoxyConnected) {
                val members = event.guild.selfMember.voiceState?.channel?.members ?: return@launch
                val channelMembers = members.filterNot { it.user.isBot }

                guild.musicSettings?.is247ModeEnabled?.let {
                    if (it) {
                        logger.info { "Not leaving voice channel in guild ${event.guild.name} - ${event.guild.id} because 24/7 mode is enabled" }
                        return@launch
                    }
                }

                if (channelMembers.isEmpty()) {
                    logger.info { "Starting inactivity timer in guild ${event.guild.name} - ${event.guild.id}" }
                    delay(30_000)
                    val stillInChannel = event.guild.selfMember.voiceState?.inAudioChannel() == true
                    val stillNonBotMembers =
                        event.guild.selfMember.voiceState?.channel?.members?.filterNot { it.user.isBot }
                            ?: return@launch
                    val manager = foxy.musicManagers[event.guild.idLong] ?: return@launch

                    if (stillInChannel && stillNonBotMembers.isEmpty()) {
                        manager.stop()
                        event.guild.audioManager.closeAudioConnection()
                        if (voiceChannel.type == ChannelType.STAGE) {
                            event.guild.getStageChannelById(voiceChannel.id)?.stageInstance?.delete()?.queue()
                        }
                        logger.info { "Left voice channel in guild ${event.guild.name} - ${event.guild.id} due to inactivity." }
                    }
                }
            }
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