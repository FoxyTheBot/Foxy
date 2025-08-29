package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.channel.Channel
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class YouTubeAddChannelExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val youtubeChannel = context.getOption("youtube_channel", type = String::class.java)!!
        val textChannel = context.getOption("text_channel", type = Channel::class.java)!!
        val message = context.getOption("message", type = String::class.java)

        if (textChannel.type.isMessage) {
            val channelInfo = context.foxy.youtubeManager.getChannelInfo(youtubeChannel)?.items?.get(0) ?: return
            val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
            val isChannelAlreadyAdded = guildData.followedYouTubeChannels.any { it.channelId == channelInfo.id }

            if (guildData.followedYouTubeChannels.size > 5) {
                context.reply {
                    content = pretty(FoxyEmotes.FoxyCry, context.locale["youtube.channel.add.youCantAddMoreChannels"])
                }
                return
            }

            if (isChannelAlreadyAdded) {
                context.reply {
                    content = pretty(
                        FoxyEmotes.FoxyRage,
                        context.locale["youtube.channel.add.youCantAddDuplicatedChannels"]
                    )
                }

                return
            }

            context.reply {
                embed {
                    title = pretty(
                        FoxyEmotes.YouTube,
                        context.locale["youtube.channel.add.title", channelInfo.snippet.title]
                    )
                    description = channelInfo.snippet.description
                    thumbnail = channelInfo.snippet.thumbnails.default.url
                    field {
                        name = context.locale["youtube.channel.add.field.customMessage"]
                        value = message
                            ?.replace("{channel.name}", channelInfo.snippet.title)
                            ?.replace("{url}", "https://www.youtube.com/watch?v=fSeFxzeo5Ts")
                            ?: context.locale["youtube.channel.add.undefined"]
                    }
                    color = Colors.RED
                }

                actionRow(
                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.SUCCESS,
                        emoji = FoxyEmotes.YouTube,
                        label = context.locale["youtube.channel.add.addButton"]
                    ) {
                        context.foxy.youtubeManager.createWebhook(channelInfo.id)

                        context.foxy.database.youtube.addChannelToAGuild(
                            context.guildId!!,
                            channelInfo.id,
                            textChannel.id,
                            message
                        )

                        it.edit {
                            actionRow(
                                context.foxy.interactionManager.createButtonForUser(
                                    context.user,
                                    ButtonStyle.SECONDARY,
                                    FoxyEmotes.YouTube,
                                    context.locale["youtube.channel.add.addedButton"]
                                ) {}.asDisabled()
                            )
                        }

                        it.reply {
                            content = context.locale[
                                "youtube.channel.add.addedSuccessfully",
                                channelInfo.snippet.title,
                                textChannel.asMention
                            ]
                        }
                    }
                )
            }
        } else return
    }
}