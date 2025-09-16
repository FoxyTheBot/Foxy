package net.cakeyfox.foxy.interactions.vanilla.music

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class StopExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val channel = context.member?.voiceState?.channel

        if (channel == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.userNotInVoiceChannel"])
            }
            return
        }

        val manager = context.foxy.musicManagers[context.guild!!.idLong]

        if (manager == null || manager.getPlayer()?.track == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.stop.nothingPlaying"])
            }
            return
        }

        manager.stop()

        context.reply(true) {
            content = pretty(FoxyEmotes.FoxyYay, context.locale["music.stop.stopped"])
        }
    }
}