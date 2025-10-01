package net.cakeyfox.foxy.interactions.vanilla.music

import dev.arbjerg.lavalink.client.event.TrackStartEvent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.music.AudioLoader
import net.cakeyfox.foxy.utils.music.getOrCreateMusicManager
import net.cakeyfox.foxy.utils.music.joinInAVoiceChannel
import net.cakeyfox.foxy.utils.music.processQuery
import net.cakeyfox.foxy.utils.music.updateStageChannelTopic

class PlayExecutor : UnleashedCommandExecutor() {
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    override suspend fun execute(context: CommandContext) {
        context.defer()
        val channel = joinInAVoiceChannel(context) ?: return
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

        link.loadItem(processQuery(query)).subscribe(AudioLoader(context, manager)).also {
            context.foxy.lavalink.on<TrackStartEvent>().subscribe { event ->
                scope.launch {
                    updateStageChannelTopic(context.foxy, event.track.info.title, context.guild!!.id)
                }
            }
        }
    }
}
