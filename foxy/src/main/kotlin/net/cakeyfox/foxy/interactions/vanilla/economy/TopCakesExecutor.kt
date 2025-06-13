package net.cakeyfox.foxy.interactions.vanilla.economy

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.leaderboard.data.LeaderboardConfig
import net.cakeyfox.foxy.utils.leaderboard.data.LeaderboardUser
import net.cakeyfox.foxy.utils.leaderboard.utils.LeaderboardRender
import net.dv8tion.jda.api.interactions.components.ActionRow
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle
import net.dv8tion.jda.api.utils.FileUpload

class TopCakesExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val topUsersWithName = context.foxy.leaderboardManager.getCakesLeaderboard()
        val pages = topUsersWithName.chunked(5)
        var currentPage = 0

        var currentFile = renderPage(context, pages, currentPage)

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["top.cakes.page", (currentPage + 1).toString()]
            )
            files.plusAssign(currentFile)
            components += buildNavButtons(context, pages, currentPage, currentFile) { newPage, file ->
                currentPage = newPage
                currentFile = file
            }
        }
    }

    private suspend fun renderPage(
        context: FoxyInteractionContext,
        pages: List<List<LeaderboardUser.CakesUser>>,
        page: Int
    ): FileUpload {
        val pageData = pages[page]
        val profile = withContext(context.foxy.coroutineDispatcher) {
            LeaderboardRender(LeaderboardConfig(), context).create(pageData)
        }
        return FileUpload.fromData(profile, "ranking_page_${page + 1}.png")
    }

    private fun buildNavButtons(
        context: FoxyInteractionContext,
        pages: List<List<LeaderboardUser.CakesUser>>,
        currentPage: Int,
        currentFile: FileUpload,
        isDisabled: Boolean = false,
        onPageChange: suspend (Int, FileUpload) -> Unit
    ): ActionRow {
        val prevButton = context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.SECONDARY,
            "⬅️"
        ) { btnContext ->
            if (currentPage > 0) {
                handlePageChange(btnContext, pages, currentPage - 1, currentFile, onPageChange)
            } else {
                btnContext.deferEdit()
            }
        }.withDisabled(currentPage == 0 || isDisabled)

        val nextButton = context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.SECONDARY,
            "➡️"
        ) { btnContext ->
            if (currentPage < pages.lastIndex) {
                handlePageChange(btnContext, pages, currentPage + 1, currentFile, onPageChange)
            } else {
                btnContext.deferEdit()
            }
        }.withDisabled(currentPage >= pages.lastIndex || isDisabled)

        return ActionRow.of(prevButton, nextButton)
    }

    private suspend fun handlePageChange(
        context: FoxyInteractionContext,
        pages: List<List<LeaderboardUser.CakesUser>>,
        newPage: Int,
        currentFile: FileUpload,
        onPageChange: suspend (Int, FileUpload) -> Unit
    ) {
        sendLoading(context, pages, newPage, currentFile)

        val newFile = renderPage(context, pages, newPage)

        context.edit {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["top.cakes.page", (newPage + 1).toString()]
            )
            files.plusAssign(newFile)
            components += buildNavButtons(context, pages, newPage, currentFile, false, onPageChange)
        }

        onPageChange(newPage, newFile)
    }

    private suspend fun sendLoading(
        context: FoxyInteractionContext,
        pages: List<List<LeaderboardUser.CakesUser>>,
        newPage: Int,
        currentFile: FileUpload
    ) {
        context.edit {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["top.cakes.loading"]
            )

            files.minusAssign(currentFile)
            components += buildNavButtons(context, pages, newPage, currentFile, true) { _, _ -> }
        }
    }
}
