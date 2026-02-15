package net.cakeyfox.foxy.listeners

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import mu.KotlinLogging
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.MessageCommandContext
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.modules.ServerLogModule
import net.cakeyfox.foxy.utils.PremiumUtils
import net.cakeyfox.foxy.utils.discord.NitroUtils
import net.cakeyfox.foxy.utils.music.AudioLoader
import net.cakeyfox.foxy.utils.music.getOrCreateMusicManager
import net.cakeyfox.foxy.utils.music.joinInAVoiceChannel
import net.cakeyfox.foxy.utils.music.processQuery
import net.dv8tion.jda.api.entities.channel.ChannelType
import net.dv8tion.jda.api.events.message.MessageDeleteEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.events.message.MessageUpdateEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import net.dv8tion.jda.api.interactions.DiscordLocale
import kotlin.system.measureTimeMillis

class MessageListener(val foxy: FoxyInstance) : ListenerAdapter() {
    private val logger = KotlinLogging.logger { }
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private val serverLogModule = ServerLogModule(foxy)

    override fun onMessageDelete(event: MessageDeleteEvent) {
        scope.launch {
            if (event.channelType == ChannelType.PRIVATE) return@launch

            val guildData = foxy.database.guild.getGuild(event.guild.id).serverLogModule
            if (guildData?.sendDeletedMessagesLogs == true) serverLogModule.processMessageDeleted(event)
        }
    }

    override fun onMessageUpdate(event: MessageUpdateEvent) {
        scope.launch {
            if (event.author.isBot || event.channelType == ChannelType.PRIVATE) return@launch

            val guildData = foxy.database.guild.getGuild(event.guild.id).serverLogModule
            if (guildData?.sendUpdatedMessagesLogs == true) serverLogModule.processUpdatedMessage(event)
        }
    }

    override fun onMessageReceived(event: MessageReceivedEvent) {
        if (event.author.isBot || event.isWebhookMessage || event.channelType == ChannelType.PRIVATE) return

        val customMember = ServerLogModule.CustomMember(
            message = event.message,
            member = event.member
        )

        scope.launch {
            val guildData = foxy.database.guild.getGuild(event.guild.id).serverLogModule

            if (guildData?.sendDeletedMessagesLogs == true || guildData?.sendUpdatedMessagesLogs == true) {
                serverLogModule.cachedMessages.put(event.messageIdLong, customMember)
            }

            processCommandOrMention(event)
            processDjFoxyMessage(event)
            if (event.member?.isBoosting == true) {
                processNitroBoost(event)
            }
        }
    }

    private suspend fun processDjFoxyMessage(event: MessageReceivedEvent) {
        val guild = foxy.database.guild.getGuild(event.guild.id)
        if (guild.musicSettings?.requestMusicChannel != event.channel.id) return

        val raw = event.message.contentRaw
        if (raw.startsWith(guild.guildSettings.prefix)) return

        val context = MessageCommandContext(event, foxy)
        val channel = joinInAVoiceChannel(context) ?: return
        val maximumQueueSize = PremiumUtils.getMaxQueueSize(context)
        val link = context.foxy.lavalink.getOrCreateLink(context.guild.idLong)
        val manager = getOrCreateMusicManager(context.guild.idLong, context.foxy.lavalink, context, channel)
        val queueSize = manager.scheduler.queue.size + 1

        if (queueSize >= maximumQueueSize) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["music.play.queueLimitReached", "100"]
                )
            }

            return
        }

        link.loadItem(processQuery(raw)).subscribe(AudioLoader(context, manager))
    }

    private suspend fun processNitroBoost(event: MessageReceivedEvent) {
        val member = event.member ?: return
        val guildAsFoxyverseGuild = foxy.database.guild.getFoxyverseGuildOrNull(event.guild.id) ?: return

        guildAsFoxyverseGuild.serverBenefits?.givePremiumIfBoosted?.let { benefit ->
            val redeemChannel = benefit.textChannelToRedeem
            if (benefit.isEnabled == true && redeemChannel != null && redeemChannel != event.message.channelId) {
                return
            }
        }

        NitroUtils.onBoostActivation(foxy, member)
    }

    private suspend fun processCommandOrMention(event: MessageReceivedEvent) {
        val guild = foxy.database.guild.getGuild(event.guild.id)
        val localeKey = DiscordLocale.from(guild.guildSettings.language)
        val locale = FoxyLocale(foxy.utils.availableLanguages[localeKey] ?: "en-us")
        val raw = event.message.contentRaw.lowercase()
        val selfUser = event.jda.selfUser

        if (raw == selfUser.asMention) {
            event.channel.sendMessage(
                pretty(
                    FoxyEmotes.FoxyHowdy,
                    locale["greetings", event.author.asMention, guild.guildSettings.prefix]
                )
            ).queue()
            return
        }

        val prefixes = listOf(
            guild.guildSettings.prefix,
            "${selfUser.asMention} "
        )

        val usedPrefix = prefixes.firstOrNull { raw.startsWith(it) } ?: return

        val commandName = raw
            .substring(usedPrefix.length)
            .substringBefore(' ')
            .lowercase()

        val command = foxy.commandHandler.getCommandAsLegacy(commandName)
        if (command == null || !command.command.enableLegacyMessageSupport) return

        if (guild.guildSettings.blockedChannels.contains(event.channel.id)) {
            if (guild.guildSettings.sendMessageIfChannelIsBlocked) {
                val message = event.channel.retrieveMessageById(event.messageId).await()
                    .reply(pretty(FoxyEmotes.FoxyRage, locale["youCantUseCommandsHere"]))
                    .await()
                delay(5000)
                message.delete().await()
            }
            return
        }

        val context = MessageCommandContext(event, foxy)
        foxy.threadPoolManager.launchMessageJob(event) {
            if (context.database.user.getFoxyProfile(event.author.id).isBanned == true) {
                foxy.utils.handleBan(event, context)
                return@launchMessageJob
            }

            val executionTime = measureTimeMillis {
                command.executor?.execute(context)
            }
            logger.info { "${context.user.name} (${context.user.id}) executed $raw in ${context.guild.name} (${context.guild.id}) in ${executionTime}ms" }
        }
    }
}
