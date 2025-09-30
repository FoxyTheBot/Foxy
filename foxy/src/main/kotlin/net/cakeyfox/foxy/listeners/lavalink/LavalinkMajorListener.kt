package net.cakeyfox.foxy.listeners.lavalink

import dev.arbjerg.lavalink.client.LavalinkClient
import dev.arbjerg.lavalink.client.event.ReadyEvent
import dev.arbjerg.lavalink.client.event.StatsEvent
import dev.arbjerg.lavalink.client.event.TrackEndEvent
import dev.arbjerg.lavalink.client.event.TrackStartEvent
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.music.updateStageChannelTopic
import net.dv8tion.jda.api.hooks.ListenerAdapter

class LavalinkMajorListener(lavalink: LavalinkClient, val foxy: FoxyInstance) : ListenerAdapter() {
    private val logger = KotlinLogging.logger { }

    init {
        lavalink.on<ReadyEvent>().subscribe { event ->
            logger.info { "Node '${event.node.name}' is ready, session id is '${event.sessionId}'!" }
        }

        lavalink.on<TrackStartEvent>().subscribe { event ->
            GlobalScope.launch {
                updateStageChannelTopic(foxy, event.track.info.title, event.guildId.toString())
            }
            logger.info { "Node '${event.node.name}' started playing a track in guild ${event.guildId}!" }
        }

        lavalink.on<TrackEndEvent>().subscribe { event ->
            foxy.musicManagers[event.guildId].let { manager ->
                manager?.scheduler?.onTrackEnd(event.track, event.endReason)
            }
        }
    }
}