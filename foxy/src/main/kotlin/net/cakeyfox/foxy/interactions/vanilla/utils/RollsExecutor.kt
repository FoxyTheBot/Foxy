package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class RollsExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val count = context.getOption("dices", 0, Long::class.java) ?: 1
        val sidesPerDie = context.getOption("sides", 1, Long::class.java) ?: 4
        val results = List(count.toInt()) { (1..sidesPerDie).random() }
        val total = results.sum()
        val key = if (count.toInt() == 1) "rolls.youSpinAndGotOne" else "rolls.youSpinAndGotMany"

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyYay,
                context.locale[key, count.toString(), sidesPerDie.toString(), total.toString()]
            )
        }
    }
}