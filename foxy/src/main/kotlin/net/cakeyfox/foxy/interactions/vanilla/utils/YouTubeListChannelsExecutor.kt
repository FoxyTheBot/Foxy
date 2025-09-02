package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.database.data.YouTubeChannel
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.interactions.components.ActionRow
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class YouTubeListChannelsExecutor : UnleashedCommandExecutor() {
    companion object {
        data class ChannelList(
            val title: String?,
            val avatar: String?,
            val channelId: String,
            val channelToSend: String,
            val message: String?
        )
    }
    override suspend fun execute(context: CommandContext) {
        context.defer()

        val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
        val followedChannels = guildData.followedYouTubeChannels
        val pages = followedChannels.chunked(1)
        var currentPage = 0

        if (followedChannels.isEmpty()) {
            context.reply {
                embed {
                    title = pretty(FoxyEmotes.YouTube, context.locale["youtube.channel.list.title"])
                    description = context.locale["youtube.channel.list.empty"]
                    color = Colors.RED
                }
            }
            return
        }

        val pageInfo = renderPage(context, pages, currentPage)

        context.reply {
            embed {
                title = pretty(FoxyEmotes.YouTube, pageInfo.title ?: "No title")
                this.thumbnail = pageInfo.avatar
                field {
                    name = "Mensagem customizada"
                    value = pageInfo.message ?: "Não definido"
                }

                field {
                    name = "Canal para enviar"
                    value = "<#${pageInfo.channelToSend}>"
                }
                footer(pageInfo.channelId)
                color = Colors.RED
            }
            components += buildNavButtons(context, pages, currentPage, pageInfo.channelId) { newPage ->
                currentPage = newPage
            }
        }
    }

    private suspend fun renderPage(
        context: CommandContext,
        pages: List<List<YouTubeChannel>>,
        page: Int
    ): ChannelList {
        val channel = pages[page].first()
        val channelInfo = context.foxy.youtubeManager.getChannelInfo(channel.channelId)?.items?.getOrNull(0)


        return if (channelInfo != null) {
            val message = channel.notificationMessage
                ?.replace("{channel.name}", channelInfo.snippet.title)
                ?.replace("{video.url}", "https://www.youtube.com/watch?v=fSeFxzeo5Ts")
                ?: context.locale["youtube.channel.add.undefined"]

            ChannelList(
                title = channelInfo.snippet.title,
                message = message,
                channelToSend = channel.channelToSend!!,
                avatar = channelInfo.snippet.thumbnails.default.url,
                channelId = channel.channelId
            )
        } else {
            ChannelList(
                title = "Unknown channel",
                avatar = null,
                channelId = channel.channelId,
                channelToSend = channel.channelToSend!!,
                message = null
            )
        }
    }

    private fun buildNavButtons(
        context: CommandContext,
        pages: List<List<YouTubeChannel>>,
        currentPage: Int,
        channelId: String? = null,
        onPageChange: suspend (Int) -> Unit
    ): ActionRow {
        val prevButton = context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.SECONDARY,
            "⬅️"
        ) { btnContext ->
            if (currentPage > 0) {
                handlePageChange(btnContext, pages, currentPage - 1, onPageChange)
            } else {
                btnContext.deferEdit()
            }
        }.withDisabled(currentPage == 0)

        val nextButton = context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.SECONDARY,
            "➡️"
        ) { btnContext ->
            if (currentPage < pages.lastIndex) {
                handlePageChange(btnContext, pages, currentPage + 1, onPageChange)
            } else {
                btnContext.deferEdit()
            }
        }.withDisabled(currentPage >= pages.lastIndex)

        if (channelId != null) {
            val removeButton = context.foxy.interactionManager.createButtonForUser(
                context.user,
                ButtonStyle.DANGER,
                label = "Remover canal"
            ) { btnContext ->
                context.foxy.database.youtube.removeChannelFromGuild(context.guildId!!, channelId)

                val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
                val updatedChannels = guildData.followedYouTubeChannels

                if (updatedChannels.isEmpty()) {
                    btnContext.edit {
                        embed {
                            title = pretty(FoxyEmotes.YouTube, context.locale["youtube.channel.list.title"])
                            description = context.locale["youtube.channel.list.empty"]
                            color = Colors.RED
                        }

                        components -= buildNavButtons(context, pages, currentPage, channelId) { }
                    }
                    return@createButtonForUser
                }

                val newPages = updatedChannels.chunked(1)
                val safePage = currentPage.coerceAtMost(newPages.lastIndex)

                handlePageChange(btnContext, newPages, safePage, onPageChange)
            }

            return ActionRow.of(prevButton, removeButton, nextButton)
        }

        return ActionRow.of(prevButton, nextButton)
    }

    private suspend fun handlePageChange(
        context: CommandContext,
        pages: List<List<YouTubeChannel>>,
        newPage: Int,
        onPageChange: suspend (Int) -> Unit
    ) {
        val pageInfo = renderPage(context, pages, newPage)

        context.edit {
            embed {
                title = pretty(FoxyEmotes.YouTube, pageInfo.title ?: "No title")
                this.thumbnail = pageInfo.avatar
                field {
                    name = "Mensagem customizada"
                    value = pageInfo.message ?: "Não definido"
                }

                field {
                    name = "Canal para enviar"
                    value = "<#${pageInfo.channelToSend}>"
                }

                footer(pageInfo.channelId)
                color = Colors.RED
            }
            components += buildNavButtons(context, pages, newPage, pageInfo.channelId, onPageChange)
        }

        onPageChange(newPage)
    }
}