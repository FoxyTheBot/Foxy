package net.cakeyfox.foxy.interactions.vanilla.music

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle

class QueueExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val manager = context.foxy.musicManagers[context.guild!!.idLong]
        val channel = context.member?.voiceState?.channel

        if (channel == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["music.play.userNotInVoiceChannel"])
            }
            return
        }

        if (manager == null || manager.getPlayer()?.track == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.stop.nothingPlaying"])
            }
            return
        }

        val tracks = manager.scheduler.queue.toList()

        if (tracks.isEmpty() && manager.getPlayer()?.track == null) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["music.queue.queueIsEmpty"])
            }
            return
        }

        val trackList = StringBuilder()
        val currentTrack = manager.getPlayer()?.track
        trackList.append("➤ **${currentTrack?.info?.author}** - ${currentTrack?.info?.title}\n\n")

        for ((index, track) in tracks.withIndex()) {
            if (index >= 10) {
                trackList.append(context.locale["music.queue.andMore", "${tracks.size - 10}"])
                break
            }
            trackList.append("**${index + 1}.** ${track.info.title} - ${track.info.author}\n")
        }

        context.reply {
            embed {
                color = Colors.BLUE
                title = pretty(FoxyEmotes.FoxyPlush, context.locale["music.queue.currentQueue"])
                description = trackList.toString()
                thumbnail = currentTrack?.info?.artworkUrl ?: Constants.FOXY_FUMO

                footer {
                    name = context.locale["music.queue.totalTracks", "${tracks.size}"]
                }
            }

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.DANGER,
                    "🗑️",
                    context.locale["music.queue.clearQueue"]
                ) {
                    if (manager.getPlayer()?.track == null) {
                        context.reply(true) {
                            content = pretty(FoxyEmotes.FoxyCry, context.locale["music.stop.nothingPlaying"])
                        }
                        return@createButtonForUser
                    }

                    manager.stop()

                    it.edit {
                        embed {
                            color = Colors.BLUE
                            title = pretty(FoxyEmotes.FoxyPlush, context.locale["music.queue.currentQueue"])
                            description = context.locale["music.queue.queueCleared"]
                            thumbnail = Constants.FOXY_FUMO

                            footer {
                                name = context.locale["music.queue.totalTracks", "0"]
                            }
                        }

                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                context.user,
                                ButtonStyle.DANGER,
                                "🗑️",
                                context.locale["music.queue.clearQueue"]
                            ) {}.withDisabled(true)
                        )
                    }
                }.withDisabled(tracks.isEmpty())
            )
        }
    }
}