package net.cakeyfox.foxy.interactions.vanilla.economy

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.leaderboard.data.LeaderboardConfig
import net.cakeyfox.foxy.utils.leaderboard.utils.LeaderboardRender
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle
import net.dv8tion.jda.api.utils.FileUpload

class TopCakesExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val topUsersWithName = context.foxy.leaderboardManager.getCakesLeaderboard()
        val pages = topUsersWithName.chunked(5)

        var currentPage = 0

        suspend fun renderPage(page: Int): FileUpload {
            val pageData = pages[page]
            val profile = withContext(Dispatchers.IO) {
                LeaderboardRender(LeaderboardConfig(), context).create(pageData)
            }
            return FileUpload.fromData(profile, "ranking_${java.util.UUID.randomUUID().toString().take(8)}.png")
        }

        var currentFile = renderPage(currentPage)

        context.reply {
            content = pretty(FoxyEmotes.FoxyDrinkingCoffee, context.locale["top.cakes.embed.title"])
            files.plusAssign(currentFile)

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.SECONDARY,
                    FoxyEmotes.FoxyDaily,
                    "<"
                ) { interaction ->
                    if (currentPage > 0) {
                        currentPage--
                        val newFile = renderPage(currentPage)

                        interaction.edit {
                            content = pretty(FoxyEmotes.FoxyDrinkingCoffee, context.locale["top.cakes.embed.title"])

                            files.minusAssign(currentFile)
                            files.plusAssign(newFile)
                        }
                        currentFile = newFile
                    } else {
                        interaction.deferEdit()
                    }
                },

                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.SECONDARY,
                    FoxyEmotes.FoxyDaily,
                    ">"
                ) { interaction ->
                    if (currentPage < pages.lastIndex) {
                        currentPage++
                        val newFile = renderPage(currentPage)

                        interaction.edit {
                            content = pretty(FoxyEmotes.FoxyDrinkingCoffee, context.locale["top.cakes.embed.title"])

                            files.minusAssign(currentFile)
                            files.plusAssign(newFile)
                        }
                        currentFile = newFile
                    } else {
                        interaction.deferEdit()
                    }
                }
            )
        }
    }
}