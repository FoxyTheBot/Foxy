package net.cakeyfox.foxy.utils.music

import kotlinx.coroutines.delay
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.entities.channel.Channel
import net.dv8tion.jda.api.entities.channel.ChannelType


suspend fun joinInAVoiceChannel(context: CommandContext, topic: String? = null): Channel? {
    val memberVoiceChannel = context.member?.voiceState?.channel
    if (memberVoiceChannel == null) {
        context.reply(true) {
            content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.userNotInVoiceChannel"])
        }
        return null
    }

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

    if (memberVoiceChannel.type == ChannelType.STAGE) return handleStageChannel(context, topic)

    val hasJoinAndSpeak = selfMember.hasPermission(
        memberVoiceChannel,
        Permission.VOICE_CONNECT,
        Permission.VOICE_SPEAK
    )

    if (!hasJoinAndSpeak) {
        context.reply(true) {
            content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.missingPermissions"])
        }
        return null
    }

    if (botVoiceChannel == null) {
        audioManager.isSelfDeafened = true
        audioManager.isAutoReconnect = true
        audioManager.openAudioConnection(memberVoiceChannel)
    }

    delay(1000) // Wait a second to ensure the bot has connected
    return memberVoiceChannel
}