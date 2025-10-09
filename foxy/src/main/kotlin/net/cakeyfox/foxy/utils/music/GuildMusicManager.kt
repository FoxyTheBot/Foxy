package net.cakeyfox.foxy.utils.music

import dev.arbjerg.lavalink.client.LavalinkClient
import dev.arbjerg.lavalink.client.Link
import dev.arbjerg.lavalink.client.player.LavalinkPlayer

class GuildMusicManager(
    val guildId: Long,
    private val lavalink: LavalinkClient
) {
    val scheduler: TrackScheduler = TrackScheduler(this)

    fun stop() {
        scheduler.queue.clear()
        getPlayer()?.let { player ->
            player.setPaused(false)
            player.setTrack(null).subscribe()
        }
    }


    fun isUserAbleToControl(userId: Long): Boolean {
        val player = getPlayer() ?: return false
        println(player)

        return true
    }

    fun changeVolume(newVolume: Long) = getPlayer()?.setVolume(newVolume.toInt())?.subscribe()

    fun getLink(): Link? = lavalink.getLinkIfCached(guildId)

    fun getPlayer(): LavalinkPlayer? = getLink()?.cachedPlayer
}