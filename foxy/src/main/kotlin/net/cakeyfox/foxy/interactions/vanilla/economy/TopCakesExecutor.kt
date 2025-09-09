package net.cakeyfox.foxy.interactions.vanilla.economy

import dev.minn.jda.ktx.messages.InlineMessage
import kotlinx.coroutines.withContext
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.leaderboard.data.LeaderboardConfig
import net.cakeyfox.foxy.leaderboard.data.LeaderboardUser
import net.cakeyfox.foxy.leaderboard.utils.LeaderboardRender
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.utils.FileUpload

class TopCakesExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
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

            buildNavButtons(context, pages, currentPage, currentFile) { newPage, file ->
                currentPage = newPage
                currentFile = file
            }
        }
    }

    private suspend fun renderPage(
        context: CommandContext,
        pages: List<List<LeaderboardUser.CakesUser>>,
        page: Int
    ): FileUpload {
        val pageData = pages[page]
        val profile = withContext(context.foxy.coroutineDispatcher) {
            LeaderboardRender(LeaderboardConfig(), context).create(pageData)
        }
        return FileUpload.fromData(profile, "ranking_page_${page + 1}.png")
    }

    private fun InlineMessage<*>.buildNavButtons(
        context: CommandContext,
        pages: List<List<LeaderboardUser.CakesUser>>,
        currentPage: Int,
        currentFile: FileUpload,
        isDisabled: Boolean = false,
        onPageChange: suspend (Int, FileUpload) -> Unit
    ) {
        val prevButton = context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.PRIMARY,
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
            ButtonStyle.PRIMARY,
            "➡️"
        ) { btnContext ->
            if (currentPage < pages.lastIndex) {
                handlePageChange(btnContext, pages, currentPage + 1, currentFile, onPageChange)
            } else {
                btnContext.deferEdit()
            }
        }.withDisabled(currentPage >= pages.lastIndex || isDisabled)

        actionRow(prevButton, nextButton)
    }

    private suspend fun handlePageChange(
        context: CommandContext,
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
            buildNavButtons(context, pages, newPage, currentFile, false, onPageChange)
        }

        onPageChange(newPage, newFile)
    }

    private suspend fun sendLoading(
        context: CommandContext,
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
            buildNavButtons(context, pages, newPage, currentFile, true) { _, _ -> }
        }
    }
}
