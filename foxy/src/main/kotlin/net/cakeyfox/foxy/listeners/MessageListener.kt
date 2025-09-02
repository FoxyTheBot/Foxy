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
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.NitroUtils
import net.cakeyfox.foxy.utils.TasksUtils
import net.dv8tion.jda.api.entities.channel.ChannelType
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.events.session.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import net.dv8tion.jda.api.interactions.DiscordLocale
import kotlin.system.measureTimeMillis

class MessageListener(val foxy: FoxyInstance) : ListenerAdapter() {
    private val logger = KotlinLogging.logger { }
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun onReady(event: ReadyEvent) {
        if (foxy.currentCluster.isMasterCluster) TasksUtils.launchTasks(foxy)
    }

    override fun onMessageReceived(event: MessageReceivedEvent) {
        if (event.author.isBot || event.isWebhookMessage || event.channelType == ChannelType.PRIVATE) return

        scope.launch {
            processCommandOrMention(event)
//            if (event.member?.isBoosting == true) {
//                processNitroBoost(event)
//            }
        }
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
        if (command == null || !command.command.supportsLegacy) return

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
