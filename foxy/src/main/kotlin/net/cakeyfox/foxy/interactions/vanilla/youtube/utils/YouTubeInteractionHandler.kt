package net.cakeyfox.foxy.interactions.vanilla.youtube.utils

import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.MediaGallery
import dev.minn.jda.ktx.interactions.components.Section
import dev.minn.jda.ktx.interactions.components.Separator
import dev.minn.jda.ktx.interactions.components.TextDisplay
import dev.minn.jda.ktx.interactions.components.Thumbnail
import dev.minn.jda.ktx.interactions.components.row
import dev.minn.jda.ktx.messages.InlineMessage
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.database.data.YouTubeChannel
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.serializable.data.utils.YouTubeQueryBody
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.components.mediagallery.MediaGalleryItem
import net.dv8tion.jda.api.components.separator.Separator

object YouTubeInteractionHandler {
    suspend fun fetchFollowedChannelsWithInfo(
        context: CommandContext
    ): List<Pair<YouTubeChannel, YouTubeQueryBody.Item?>> {
        val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
        return guildData.followedYouTubeChannels.map { storedChannel ->
            val youtubeApiChannel = context.foxy.youtubeManager
                .getChannelInfo(storedChannel.channelId)
                ?.items
                ?.firstOrNull()
            storedChannel to youtubeApiChannel
        }
    }

    fun InlineMessage<*>.renderFollowedChannelsList(
        context: CommandContext,
        followedChannelsWithInfo: List<Pair<YouTubeChannel, YouTubeQueryBody.Item?>>,
        maxChannelsAvailable: Int
    ) {
        components += Container {
            accentColor = Colors.RED

            +MediaGallery {
                +MediaGalleryItem.fromUrl(Constants.FOXY_BANNER)
            }

            if (followedChannelsWithInfo.isEmpty()) {
                +Separator(true, Separator.Spacing.SMALL)
                +TextDisplay(context.locale["youtube.channel.list.boldEmpty"])
            }

            followedChannelsWithInfo.forEach { (storedChannel, youtubeApiChannel) ->
                val title = youtubeApiChannel?.snippet?.title
                    ?: context.locale["youtube.channel.list.unknownChannel"]

                +Separator(true, Separator.Spacing.SMALL)
                +Section(
                    YouTubeComponentBuilder.buildViewChannelButton(
                        context,
                        storedChannel,
                        youtubeApiChannel,
                        maxChannelsAvailable
                    )
                ) {
                    +TextDisplay("### $title")
                    +TextDisplay(
                        context.locale["youtube.channel.list.iWillNotifyIn", "<#${storedChannel.channelToSend}>"]
                    )
                }
            }

            +Separator(true, Separator.Spacing.SMALL)
            +TextDisplay(context.locale["youtube.channel.list.maxChannels", maxChannelsAvailable.toString()])
            +row(
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.SUCCESS,
                    label = context.locale["youtube.channel.list.addButton"],
                    emoji = FoxyEmotes.YouTube,
                    builder = {
                        if (followedChannelsWithInfo.size >= maxChannelsAvailable) {
                            disabled = true
                        }
                    }
                ) { YouTubeModalHandler.showAddChannelModal(it, maxChannelsAvailable) },
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.SECONDARY,
                    label = "${followedChannelsWithInfo.size}/$maxChannelsAvailable"
                ) {}.withDisabled(true)
            )
        }
    }

    fun InlineMessage<*>.renderChannelEditView(
        context: CommandContext,
        storedChannel: YouTubeChannel,
        youtubeApiChannel: YouTubeQueryBody.Item?,
        maxChannelsAvailable: Int
    ) {
        components += Container {
            accentColor = Colors.RED

            +Section(Thumbnail(youtubeApiChannel!!.snippet.thumbnails.default.url)) {
                +TextDisplay("### ${youtubeApiChannel.snippet.title}")
                +TextDisplay(
                    context.locale["youtube.channel.list.iWillNotifyInBold", "<#${storedChannel.channelToSend}>"]
                )
            }

            +Separator(true, Separator.Spacing.SMALL)

            +Section(
                YouTubeComponentBuilder.buildEditCustomMessageButton(
                    context,
                    youtubeApiChannel,
                    maxChannelsAvailable
                )
            ) {
                +TextDisplay(context.locale["youtube.channel.list.customMessageBold"])
                val message = storedChannel.notificationMessage
                    ?.replace("{channel.name}", youtubeApiChannel.snippet.title)
                    ?.replace("{video.url}", "https://www.youtube.com/watch?v=fSeFxzeo5Ts")
                    .takeIf { it?.isNotBlank() == true } ?: context.locale["youtube.channel.list.noCustomMessage"]

                +TextDisplay(message)
            }

            +Separator(true, Separator.Spacing.SMALL)
            +row(
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.SECONDARY,
                    emoji = FoxyEmotes.Back,
                    label = context.locale["youtube.channel.list.backButton"]
                ) { btnContext ->
                    val followedChannelsWithInfo = fetchFollowedChannelsWithInfo(context)
                    btnContext.edit {
                        useComponentsV2 = true
                        renderFollowedChannelsList(btnContext, followedChannelsWithInfo, maxChannelsAvailable)
                    }
                },

                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.DANGER,
                    emoji = FoxyEmotes.TrashCan,
                    label = context.locale["youtube.channel.list.removeButton"]
                ) { btnContext ->
                    val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
                    val stillExists = guildData.followedYouTubeChannels.any { it.channelId == youtubeApiChannel.id }

                    if (stillExists) {
                        context.foxy.database.youtube.removeChannelFromGuild(context.guildId!!, storedChannel.channelId)
                        val followedChannelsWithInfo = fetchFollowedChannelsWithInfo(context)

                        btnContext.edit {
                            useComponentsV2 = true
                            renderFollowedChannelsList(btnContext, followedChannelsWithInfo, maxChannelsAvailable)
                        }
                    }
                }
            )
        }
    }
}