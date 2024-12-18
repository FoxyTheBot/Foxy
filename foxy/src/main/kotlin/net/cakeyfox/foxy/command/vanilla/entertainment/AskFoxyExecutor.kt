package net.cakeyfox.foxy.command.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor

class AskFoxyExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        val answers = listOf(
            context.locale["ask.foxy.yes"],
            context.locale["ask.foxy.no"],
            context.locale["ask.foxy.maybe"],
            context.locale["ask.foxy.askLater"],
            context.locale["ask.foxy.cantAnswer"],
            context.locale["ask.foxy.noIdea"],
            context.locale["ask.foxy.noComment"],
            context.locale["ask.foxy.noWay"],
            context.locale["ask.foxy.yesSure"],
            context.locale["ask.foxy.yesNo"],
            context.locale["ask.foxy.noYes"]
        )

        context.reply {
            content = context.prettyResponse {
                emoteId = FoxyEmotes.FOXY_THINK
                content = getRandomAnswer(answers)
            }
        }
    }

    private fun getRandomAnswer(answers: List<String>): String {
        return answers.random()
    }
}