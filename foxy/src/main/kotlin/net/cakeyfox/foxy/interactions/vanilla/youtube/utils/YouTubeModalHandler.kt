package net.cakeyfox.foxy.interactions.vanilla.youtube.utils

import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.Section
import dev.minn.jda.ktx.interactions.components.Separator
import dev.minn.jda.ktx.interactions.components.TextDisplay
import dev.minn.jda.ktx.interactions.components.Thumbnail
import dev.minn.jda.ktx.interactions.components.row
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.interactions.vanilla.youtube.utils.YouTubeInteractionHandler.fetchFollowedChannelsWithInfo
import net.cakeyfox.foxy.interactions.vanilla.youtube.utils.YouTubeInteractionHandler.renderChannelEditView
import net.cakeyfox.foxy.interactions.vanilla.youtube.utils.YouTubeInteractionHandler.renderFollowedChannelsList
import net.cakeyfox.serializable.data.utils.YouTubeQueryBody
import net.dv8tion.jda.api.components.selections.EntitySelectMenu
import net.dv8tion.jda.api.components.separator.Separator
import net.dv8tion.jda.api.components.textinput.TextInput
import net.dv8tion.jda.api.components.textinput.TextInputStyle
import net.dv8tion.jda.api.entities.channel.ChannelType

object YouTubeModalHandler {
    suspend fun showAddChannelModal(
        context: CommandContext,
        maxChannelsAvailable: Int
    ) {
        context.sendModal(
            context.foxy.interactionManager.createModal(
                context.locale["youtube.channel.list.addModal.title"], {
                    val youtubeChannel = TextInput.create(
                        "channel",
                        context.locale["youtube.channel.list.addModal.label"],
                        TextInputStyle.SHORT
                    )
                        .setPlaceholder(context.locale["youtube.channel.list.addModal.channelPlaceholder"])
                        .setRequired(true)
                        .build()

                    val customMessageInput = TextInput.create(
                        "customMessage",
                        context.locale["youtube.channel.list.modal.label"],
                        TextInputStyle.PARAGRAPH
                    )
                        .setPlaceholder(context.locale["youtube.channel.list.modal.placeholder"])
                        .setRequired(false)
                        .setMaxLength(250)
                        .build()

                    components = listOf(
                        row(youtubeChannel),
                        row(customMessageInput)
                    )
                }
            ) { modalContext ->
                val channelValue = modalContext.getValue("channel")!!.asString
                val customMessage = modalContext.getValue("customMessage")?.asString

                val channelInfo = context.foxy.youtubeManager.getChannelInfo(channelValue)
                    ?.items?.get(0) ?: return@createModal

                val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
                val isChannelAlreadyAdded = guildData.followedYouTubeChannels.any { it.channelId == channelInfo.id }

                if (guildData.followedYouTubeChannels.size >= 5) {
                    context.reply {
                        content = pretty(
                            FoxyEmotes.FoxyCry,
                            context.locale["youtube.channel.add.youCantAddMoreChannels"]
                        )
                    }
                    return@createModal
                }

                if (isChannelAlreadyAdded) {
                    context.reply {
                        content = pretty(
                            FoxyEmotes.FoxyRage,
                            context.locale["youtube.channel.add.youCantAddDuplicatedChannels"]
                        )
                    }

                    return@createModal
                }

                modalContext.deferEdit()
                context.edit {
                    useComponentsV2 = true
                    components += Container {
                        accentColor = Colors.RED

                        +Section(Thumbnail(channelInfo.snippet.thumbnails.default.url)) {
                            +TextDisplay(context.locale["youtube.channel.list.addChannel", channelInfo.snippet.title])
                            +TextDisplay(context.locale["youtube.channel.list.whereDoISendNewVideos"])
                        }
                        +Separator(true, Separator.Spacing.SMALL)
                        +row(
                            context.foxy.interactionManager.entitySelectMenuForUser(
                                context.user,
                                type = EntitySelectMenu.SelectTarget.CHANNEL,
                                builder = {
                                    setMaxValues(1)
                                    setChannelTypes(
                                        ChannelType.TEXT,
                                        ChannelType.NEWS
                                    )
                                },
                            ) { selectMenuContext, strings ->
                                val channel = strings.first()

                                context.foxy.youtubeManager.createWebhook(channelInfo.id)
                                context.foxy.database.youtube.addChannelToAGuild(
                                    context.guildId!!,
                                    channelInfo.id,
                                    channel.id,
                                    customMessage
                                )

                                selectMenuContext.deferEdit()
                                val followedChannelsWithInfo = fetchFollowedChannelsWithInfo(context)

                                context.edit {
                                    useComponentsV2 = true
                                    renderFollowedChannelsList(context, followedChannelsWithInfo, maxChannelsAvailable)
                                }
                            }
                        )
                    }
                }
            }
        )
    }

    suspend fun showCustomMessageModal(
        context: CommandContext,
        youtubeApiChannel: YouTubeQueryBody.Item,
        maxChannelsAvailable: Int
    ) {
        context.sendModal(
            context.foxy.interactionManager.createModal(
                context.locale["youtube.channel.list.modal.title"], {
                    val customMessageInput = TextInput.create(
                        "customMessage",
                        context.locale["youtube.channel.list.modal.label"],
                        TextInputStyle.PARAGRAPH
                    )
                        .setPlaceholder(context.locale["youtube.channel.list.modal.placeholder"])
                        .setRequired(true)
                        .setMaxLength(250)
                        .build()

                    components = listOf(row(customMessageInput))
                }
            ) { modalContext ->
                val newCustomMessage = modalContext.getValue("customMessage")?.asString

                context.foxy.database.youtube.updateChannelCustomMessage(
                    context.guildId!!,
                    youtubeApiChannel.id,
                    newCustomMessage
                )

                val updatedStoredChannel = context.foxy.database.guild.getGuild(context.guildId!!)
                    .followedYouTubeChannels.find { it.channelId == youtubeApiChannel.id }!!

                modalContext.deferEdit()

                context.edit {
                    useComponentsV2 = true
                    renderChannelEditView(context, updatedStoredChannel, youtubeApiChannel, maxChannelsAvailable)
                }
            }
        )
    }
}