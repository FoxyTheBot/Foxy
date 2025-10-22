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
    private val pageSize = 5

    override suspend fun execute(context: CommandContext) {
        context.defer()

        var currentPage = 0
        val pageData = context.foxy.leaderboardManager.getCakesLeaderboardByPage(
            page = currentPage + 1,
            pageSize = pageSize
        )

        var currentFile = renderPage(context, pageData, currentPage)

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["top.cakes.page", (currentPage + 1).toString()]
            )
            files.plusAssign(currentFile)

            buildNavButtons(context, currentPage, currentFile) { newPage, newFile ->
                currentPage = newPage
                currentFile = newFile
            }
        }
    }

    private suspend fun renderPage(
        context: CommandContext,
        pageData: List<LeaderboardUser.CakesUser>,
        pageNumber: Int
    ): FileUpload {
        val profile = withContext(context.foxy.coroutineDispatcher) {
            LeaderboardRender(LeaderboardConfig(), context).create(pageData)
        }
        return FileUpload.fromData(profile, "ranking_page_${pageNumber + 1}.png")
    }

    private fun InlineMessage<*>.buildDisabledNavButtons(
        context: CommandContext,
        isBack: Boolean,
    ) {
        val prevButton = context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.PRIMARY,
            if (isBack) { "<a:pet_the_foxy:775566720425394188>" } else "⬅️"
        ) {}.withDisabled(true)

        val nextButton = context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.PRIMARY,
            if (!isBack) { "<a:pet_the_foxy:775566720425394188>" } else "➡️"
        ) { }.withDisabled(true)

        actionRow(prevButton, nextButton)
    }

    private fun InlineMessage<*>.buildNavButtons(
        context: CommandContext,
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
                handlePageChange(btnContext, currentPage - 1, currentFile, true, onPageChange)
            } else {
                btnContext.deferEdit()
            }
        }.withDisabled(currentPage == 0 || isDisabled)

        val nextButton = context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.PRIMARY,
            "➡️"
        ) { btnContext ->
            handlePageChange(btnContext, currentPage + 1, currentFile, false, onPageChange)
        }.withDisabled(isDisabled)

        actionRow(prevButton, nextButton)
    }

    private suspend fun handlePageChange(
        context: CommandContext,
        newPage: Int,
        currentFile: FileUpload,
        isBack: Boolean,
        onPageChange: suspend (Int, FileUpload) -> Unit
    ) {
        sendLoading(context, currentFile, isBack)

        val pageData = context.foxy.leaderboardManager.getCakesLeaderboardByPage(
            page = newPage + 1,
            pageSize = pageSize
        )

        val newFile = renderPage(context, pageData, newPage)

        context.edit {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["top.cakes.page", (newPage + 1).toString()]
            )
            files.plusAssign(newFile)

            buildNavButtons(context, newPage, newFile, false, onPageChange)
        }

        onPageChange(newPage, newFile)
    }

    private suspend fun sendLoading(context: CommandContext, currentFile: FileUpload, isBack: Boolean) {
        context.edit {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["top.cakes.loading"]
            )
            buildDisabledNavButtons(context, isBack)
            files.minusAssign(currentFile)
        }
    }
}
