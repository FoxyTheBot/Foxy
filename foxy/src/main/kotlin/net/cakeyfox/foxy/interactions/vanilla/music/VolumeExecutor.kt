package net.cakeyfox.foxy.interactions.vanilla.music

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.music.getOrCreateMusicManager

class VolumeExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val volume = context.getOption("level", 0, Long::class.java)
        val lavalink = context.foxy.lavalink
        val channel = context.member!!.voiceState?.channel
        val guildId = context.guild!!.idLong

        if (channel == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.userNotInVoiceChannel"])
            }
            return
        }

        if (volume == null || volume < 0 || volume > 100) {
            context.reply(ephemeral = true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["music.volume.volumeRange"])
            }
            return
        }

        val manager = getOrCreateMusicManager(guildId, lavalink, context, channel)
        manager.changeVolume(volume)

        context.reply {
            content = pretty(FoxyEmotes.FoxyYay, context.locale["music.volume.setTo", "$volume%"])
        }
    }
}