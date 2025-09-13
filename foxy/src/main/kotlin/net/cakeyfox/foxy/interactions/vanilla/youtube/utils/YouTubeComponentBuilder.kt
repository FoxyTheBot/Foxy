package net.cakeyfox.foxy.interactions.vanilla.youtube.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.database.data.YouTubeChannel
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.vanilla.youtube.utils.YouTubeInteractionHandler.renderChannelEditView
import net.cakeyfox.serializable.data.utils.YouTubeQueryBody
import net.dv8tion.jda.api.components.buttons.Button
import net.dv8tion.jda.api.components.buttons.ButtonStyle

object YouTubeComponentBuilder {
    fun buildEditCustomMessageButton(
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
            YouTubeModalHandler.showCustomMessageModal(it, youtubeApiChannel, maxChannelsAvailable)
        }
    }

    fun buildViewChannelButton(
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