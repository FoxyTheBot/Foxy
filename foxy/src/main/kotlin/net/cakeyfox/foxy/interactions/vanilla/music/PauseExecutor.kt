package net.cakeyfox.foxy.interactions.vanilla.music

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.music.getOrCreateMusicManager

class PauseExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val channel = context.member!!.voiceState?.channel
        val lavalink = context.foxy.lavalink

        if (channel == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.userNotInVoiceChannel"])
            }
            return
        }

        val manager = getOrCreateMusicManager(context.guild!!.idLong, lavalink, context, channel)
        val player = manager.getPlayer()

        if (player?.track == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.pause.nothingPlaying"])
            }
            return
        }

       val isPaused = manager.scheduler.pauseOrResume() ?: return

        if (isPaused) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyYay, context.locale["music.pause.paused"])
            }
        } else {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyOk, context.locale["music.pause.resumed"])
            }
        }
    }
}