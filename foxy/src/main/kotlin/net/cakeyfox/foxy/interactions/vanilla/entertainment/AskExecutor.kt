package net.cakeyfox.foxy.interactions.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class AskExecutor: CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val answers = listOf(
            context.locale["ask.foxy.true"],
            context.locale["ask.foxy.false"],
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
            content = pretty(
                FoxyEmotes.FoxyHm,
                getRandomAnswer(answers)
            )
        }
    }

    private fun getRandomAnswer(answers: List<String>): String {
        return answers.random()
    }
}