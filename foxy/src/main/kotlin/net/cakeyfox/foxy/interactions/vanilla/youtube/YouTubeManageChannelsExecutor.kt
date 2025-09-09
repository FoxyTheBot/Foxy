package net.cakeyfox.foxy.interactions.vanilla.youtube

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
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.PremiumUtils
import net.cakeyfox.serializable.data.utils.YouTubeQueryBody
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.components.buttons.Button
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.components.mediagallery.MediaGalleryItem
import net.dv8tion.jda.api.components.selections.EntitySelectMenu
import net.dv8tion.jda.api.components.separator.Separator
import net.dv8tion.jda.api.components.textinput.TextInput
import net.dv8tion.jda.api.components.textinput.TextInputStyle
import net.dv8tion.jda.api.entities.channel.ChannelType

class YouTubeManageChannelsExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()

        if (context.member?.hasPermission(Permission.MANAGE_SERVER) == false) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyRage, context.locale["youDontHavePermissionToDoThat"])
            }
            return
        }

        val followedChannelsWithInfo = fetchFollowedChannelsWithInfo(context)
        val maxChannelsAvailable = PremiumUtils.maximumYouTubeChannels(context)

        context.reply {
            useComponentsV2 = true
            renderFollowedChannelsList(context, followedChannelsWithInfo, maxChannelsAvailable)
        }
    }

    private suspend fun showAddChannelModal(
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
                                    setChannelTypes(ChannelType.TEXT, ChannelType.GUILD_NEWS_THREAD)
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

    private suspend fun showCustomMessageModal(
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

    private suspend fun fetchFollowedChannelsWithInfo(
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

    private fun InlineMessage<*>.renderFollowedChannelsList(
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
                +Section(buildViewChannelButton(context, storedChannel, youtubeApiChannel, maxChannelsAvailable)) {
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
                ) { showAddChannelModal(it, maxChannelsAvailable) },
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.SECONDARY,
                    label = "${followedChannelsWithInfo.size}/$maxChannelsAvailable"
                ) {}.withDisabled(true)
            )
        }
    }

    private fun InlineMessage<*>.renderChannelEditView(
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

            +Section(buildEditCustomMessageButton(context, youtubeApiChannel, maxChannelsAvailable)) {
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

    private fun buildEditCustomMessageButton(
        context: CommandContext,
        youtubeApiChannel: YouTubeQueryBody.Item,
        maxChannelsAvailable: Int
    ): Button {
        return context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.PRIMARY,
            emoji = FoxyEmotes.PaintBrush,
            label = context.locale["youtube.channel.list.editCustomMessage"]
        ) {
            showCustomMessageModal(it, youtubeApiChannel, maxChannelsAvailable)
        }
    }

    private fun buildViewChannelButton(
        context: CommandContext,
        storedChannel: YouTubeChannel,
        youtubeApiChannel: YouTubeQueryBody.Item?,
        maxChannelsAvailable: Int
    ): Button {
        return context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.SECONDARY,
            label = context.locale["youtube.channel.list.editButton"],
            emoji = FoxyEmotes.PaintBrush,
        ) {
            it.edit {
                useComponentsV2 = true
                renderChannelEditView(it, storedChannel, youtubeApiChannel, maxChannelsAvailable)
            }
        }
    }
}