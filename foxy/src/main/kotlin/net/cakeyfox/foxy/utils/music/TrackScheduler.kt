package net.cakeyfox.foxy.utils.music

import dev.arbjerg.lavalink.client.player.Track
import dev.arbjerg.lavalink.protocol.v4.Message
import java.util.Queue
import java.util.concurrent.ConcurrentLinkedQueue

class TrackScheduler(private val guildMusicManager: GuildMusicManager) {
    val queue: Queue<Track> = ConcurrentLinkedQueue()

    fun enqueue(track: Track) {
        val player = guildMusicManager.getPlayer()
        if (player?.track == null) {
            startTrack(track)
        } else {
            queue.offer(track)
        }
    }

    fun getQueue(): List<Track> = queue.toList()

    fun clearQueue() = queue.clear()

    fun enqueuePlaylist(tracks: List<Track>) {
        queue.addAll(tracks)
        val player = guildMusicManager.getPlayer()
        if (player?.track == null) {
            queue.poll()?.let { startTrack(it) }
        }
    }

    fun pauseOrResume() : Boolean? {
        val player = guildMusicManager.getPlayer() ?: return null
        if (player.paused) {
            guildMusicManager.getPlayer()?.setPaused(false)?.subscribe()
            return false
        } else {
            guildMusicManager.getPlayer()?.setPaused(true)?.subscribe()
            return true
        }
    }

    fun skipTrack(): Track? {
        val player = guildMusicManager.getPlayer()
        if (player?.track != null) {
            player.setTrack(null).subscribe()
           return queue.poll()?.let {
                startTrack(it)
                it
            }
        }
        return null
    }

    fun onTrackEnd(track: Track, endReason: Message.EmittedEvent.TrackEndEvent.AudioTrackEndReason) {
        if (endReason.mayStartNext) {
            queue.poll()?.let { startTrack(it) }
        }
    }

    private fun startTrack(track: Track) {
        guildMusicManager.getLink()?.createOrUpdatePlayer()?.setTrack(track)?.setVolume(35)?.subscribe()
    }
}