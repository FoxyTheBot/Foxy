package net.cakeyfox.foxy.interactions.vanilla.music

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.music.getOrCreateMusicManager

class SkipExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val guildId = context.guild!!.idLong
        val channel = context.member?.voiceState?.channel

        if (channel == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.userNotInVoiceChannel"])
            }

            return
        }

        val lavalink = context.foxy.lavalink
        val musicManager = getOrCreateMusicManager(guildId, lavalink, context, channel!!)

        val player = musicManager.getPlayer()

        if (player?.track == null) {
            context.reply {
                embed {
                    color = Colors.BLUE
                    title = pretty(FoxyEmotes.FoxyCry, context.locale["music.skip.noTrack.title"])
                    description = context.locale["music.skip.noTrack.description"]
                }
            }

            return
        }

        val wasPlaying = player.track
        val nextTrack = musicManager.scheduler.skipTrack()
        val wasPlayingTrackName = wasPlaying?.info?.title
        val wasPlayingTrackAuthor = wasPlaying?.info?.author
        val nextTrackName = nextTrack?.info?.title
        val nextTrackAuthor = nextTrack?.info?.author

        context.reply {
            embed {
                color = Colors.BLUE
                thumbnail = nextTrack?.info?.artworkUrl

                field {
                    name = pretty(FoxyEmotes.FoxyOk, context.locale["music.skip.wasPlaying"])
                    value = "**[$wasPlayingTrackAuthor - $wasPlayingTrackName](${wasPlaying?.info?.uri})**"
                    inline = false
                }

                field {
                    name = pretty(FoxyEmotes.FoxyYay, context.locale["music.skip.currentlyPlaying"])
                    value = nextTrack?.let { "**[$nextTrackAuthor - ${nextTrackName}](${it.info.uri})**" }
                        ?: context.locale["music.skip.noMoreTracks"]
                    inline = false
                }
            }
        }
    }
}