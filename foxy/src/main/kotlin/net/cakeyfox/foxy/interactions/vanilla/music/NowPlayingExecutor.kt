package net.cakeyfox.foxy.interactions.vanilla.music

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class NowPlayingExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val link = context.foxy.lavalink.getOrCreateLink(context.guild!!.idLong)
        val player = link.cachedPlayer

        if (player == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.nowPlaying.nothingPlaying"])
            }
            return
        }

        val track = player.track

        if (track == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.nowPlaying.nothingPlaying"])
            }
            return
        }

        val trackInfo = track.info

        val title = trackInfo.title
        val author = trackInfo.author
        val uri = trackInfo.uri ?: context.locale["music.nowPlaying.unknownUri"]
        val duration = if (trackInfo.length >= 0) {
            val totalSeconds = trackInfo.length / 1000
            val minutes = totalSeconds / 60
            val seconds = totalSeconds % 60
            String.format("%d:%02d", minutes, seconds)
        } else context.locale["music.nowPlaying.unknownDuration"]


        context.reply {
            embed {
                color = Colors.BLUE
                this.title = pretty("🎵", context.locale["music.nowPlaying.nowPlaying"])
                this.description = "**[$title]($uri)**"

                this.field {
                    name = context.locale["music.nowPlaying.byAuthor"]
                    value = "**$author**"
                    inline = false
                }

                this.field {
                    name = context.locale["music.nowPlaying.duration"]
                    value = "`$duration`"
                    inline = true
                }

                this.field {
                    name = context.locale["music.nowPlaying.volume"]
                    value = "`${player.volume}%`"
                    inline = true
                }

                this.thumbnail = trackInfo.artworkUrl
            }
        }
    }
}