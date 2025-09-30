package net.cakeyfox.foxy.utils.music

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.delay
import mu.KotlinLogging
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.entities.channel.Channel
import net.dv8tion.jda.api.entities.channel.ChannelType

suspend fun handleStageChannel(context: CommandContext, topic: String? = null): Channel? {
    val memberVoiceChannel = context.member?.voiceState?.channel

    val audioManager = context.guild!!.audioManager
    val selfMember = context.guild!!.selfMember
    val botVoiceChannel = selfMember.voiceState?.channel

    if (botVoiceChannel != null && botVoiceChannel != memberVoiceChannel) {
        context.reply(true) {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["music.play.alreadyConnectedInAnotherChannel", botVoiceChannel.asMention]
            )
        }
        return null
    }

    val hasJoinAndSpeak = selfMember.hasPermission(
        Permission.VOICE_CONNECT,
        Permission.VOICE_SPEAK
    )

    if (!hasJoinAndSpeak) {
        context.reply(true) {
            content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.missingPermissions"])
        }
        return null
    }

    // Managing Stage Channel is different than normal voice channel, so let's get the stage channel instance

    val stageChannel = context.guild!!.getStageChannelById(memberVoiceChannel!!.id)

    if (stageChannel?.stageInstance == null) {
        // Create a new stage instance
        try {
            stageChannel?.createStageInstance(topic ?: "Foxy Stage Channel")?.await()
        } catch (e: Exception) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.couldNotCreateStageInstance"])
            }
            return null
        }
    } else {
        // Update the existing stage instance topic if needed
        if (topic != null && stageChannel.stageInstance?.topic != topic) {
            try {
                stageChannel.stageInstance?.manager?.setTopic(topic)?.await()
            } catch (e: Exception) {
                context.reply(true) {
                    content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.couldNotUpdateStageTopic"])
                }
                return null
            }
        }
    }

    val updatedBotVoiceChannel = selfMember.voiceState?.channel

    if (updatedBotVoiceChannel == null) {
        audioManager.isSelfDeafened = true
        audioManager.isAutoReconnect = true
        // requestToSpeak will ask for moderator approval if the bot doesn't have the permission "VOICE_MUTE_OTHERS"
        audioManager.openAudioConnection(memberVoiceChannel)
        delay(1000) // Wait a second to ensure the bot has connected
        stageChannel?.requestToSpeak()?.queue()
    }

    return stageChannel
}

suspend fun updateStageChannelTopic(foxy: FoxyInstance, topic: String, guildId: String) {
    val guild = foxy.shardManager.getGuildById(guildId) ?: return

    val botVoiceChannel = guild.selfMember.voiceState?.channel ?: return
    if (botVoiceChannel.type != ChannelType.STAGE) return

    val stageChannel = guild.getStageChannelById(botVoiceChannel.id) ?: return

    if (stageChannel.stageInstance == null) return

    try {
        delay(1000)
        stageChannel.stageInstance?.manager?.setTopic(topic)?.await()
    } catch (e: Exception) {
        KotlinLogging.logger { }.error(e) { "Failed to update stage channel topic: ${e.message}" }
    }
}