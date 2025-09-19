package net.cakeyfox.foxy.interactions.vanilla.music

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.music.AudioLoader
import net.cakeyfox.foxy.utils.music.getOrCreateMusicManager
import net.cakeyfox.foxy.utils.joinInAVoiceChannel
import net.cakeyfox.foxy.utils.music.processQuery

class PlayExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val channel = joinInAVoiceChannel(context) ?: return
        context.defer()
        val query = context.getOption("query", 0, String::class.java, true)

        if (query.isNullOrBlank()) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.play.youMustProvideASong"])
            }
            return
        }

        val link = context.foxy.lavalink.getOrCreateLink(context.guild!!.idLong)
        val manager = getOrCreateMusicManager(context.guild!!.idLong, context.foxy.lavalink, context, channel)
        val queueSize = manager.scheduler.queue.size + 1

        if (queueSize >= 100) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.play.queueLimitReached", "100"])
            }
            return
        }

        link.loadItem(processQuery(query)).subscribe(AudioLoader(context, manager))
    }
}
