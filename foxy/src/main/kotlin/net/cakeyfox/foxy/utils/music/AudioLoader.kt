package net.cakeyfox.foxy.utils.music

import dev.arbjerg.lavalink.client.AbstractAudioLoadResultHandler
import dev.arbjerg.lavalink.client.player.LoadFailed
import dev.arbjerg.lavalink.client.player.PlaylistLoaded
import dev.arbjerg.lavalink.client.player.SearchResult
import dev.arbjerg.lavalink.client.player.TrackLoaded
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.pretty
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.javaField

class AudioLoader(val context: CommandContext, val manager: GuildMusicManager) : AbstractAudioLoadResultHandler() {
    private val replyScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    val sourceNamesMap = mapOf(
        "youtube" to "YouTube",
        "soundcloud" to "SoundCloud",
        "deezer" to "Deezer",
        // Only Discord CDN is authorized to use http source
        "http" to "Discord",
    )

    override fun loadFailed(result: LoadFailed) {
        replyScope.launch {
            context.reply {
                embed {
                    title = pretty(FoxyEmotes.FoxyCry, context.locale["music.play.loadFailed.title"])
                    description = context.locale[
                        "music.play.loadFailed.description",
                        result.exception.message ?: "Unknown error"
                    ]
                    color = Colors.BLUE
                }
            }
        }
    }

    override fun noMatches() {
        replyScope.launch {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.play.noMatches"])
            }
        }
    }

    override fun onPlaylistLoaded(result: PlaylistLoaded) {
        replyScope.launch {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.play.playlistsNotSupported"])
            }
        }
    }

    override fun onSearchResultLoaded(result: SearchResult) {
        val tracks = result.tracks

        if (tracks.isEmpty()) {
            replyScope.launch {
                context.reply {
                    content = pretty(FoxyEmotes.FoxyCry, context.locale["music.play.noMatches"])
                }
            }
            return
        }

        this.manager.scheduler.enqueue(tracks.first())
        val trackTitle = tracks.first().info.title
        val sourceName = tracks.first().info.sourceName
        val emote = FoxyEmotes::class.memberProperties
            .firstOrNull { it.name.equals(sourceName, ignoreCase = true) }
            ?.javaField
            ?.get(null)
                as? String ?: "❓"
        val formattedName = sourceNamesMap[sourceName] ?: sourceName

        replyScope.launch {
            context.reply {
                embed {
                    color = Colors.BLUE
                    title = pretty("🎵", context.locale["music.play.addedToQueue"])
                    description = "**[$trackTitle](${tracks.first().info.uri})**"
                    thumbnail = tracks.first().info.artworkUrl

                    field {
                        name = pretty("📡", context.locale["music.play.source"])
                        value = "$emote $formattedName"
                        inline = true
                    }
                }
            }
        }
    }

    override fun ontrackLoaded(result: TrackLoaded) {
        val track = result.track
        val trackTitle = track.info.title
        val trackAuthor = track.info.author
        val sourceName = track.info.sourceName
        val emote = FoxyEmotes::class.memberProperties
            .firstOrNull { it.name.equals(sourceName, ignoreCase = true) }
            ?.javaField
            ?.get(null)
                as? String ?: "❓"
        val formattedName = sourceNamesMap[sourceName] ?: sourceName

        val link = context.foxy.lavalink.getOrCreateLink(context.guild!!.idLong)
        val currentPlaying = link.cachedPlayer?.track
        val isFirstTrack = currentPlaying == null && manager.scheduler.queue.isEmpty()

        replyScope.launch {
            context.reply {
                if (isFirstTrack) {
                    embed {
                        color = Colors.BLUE
                        title = pretty("🎵", context.locale["music.play.nowPlaying"])
                        description = "**[$trackAuthor - $trackTitle](${track.info.uri})**"
                        thumbnail = track.info.artworkUrl

                        field {
                            name = pretty("📡", context.locale["music.play.source"])
                            value = "$emote $formattedName"
                            inline = true
                        }
                    }
                } else {
                    embed {
                        color = Colors.AQUA
                        title = pretty("💿", context.locale["music.play.addedToQueue"])
                        description = "**[$trackAuthor - $trackTitle](${track.info.uri})**"
                        thumbnail = track.info.artworkUrl

                        field {
                            name = pretty("📡", context.locale["music.play.source"])
                            value = "$emote $formattedName"
                            inline = true
                        }
                    }
                }
            }
        }


        this.manager.scheduler.enqueue(track)
    }
}