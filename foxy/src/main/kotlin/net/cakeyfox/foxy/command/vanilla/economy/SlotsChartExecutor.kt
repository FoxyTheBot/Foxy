package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty

class SlotsChartExecutor : FoxyCommandExecutor() {
    companion object {
        val multipliers = mapOf(
            "🍒" to 2,
            "🍉" to 3,
            "🍋" to 5,
            "🍀" to 7,
            "💎" to 10,
            "🦊" to 50
        )
    }

    override suspend fun execute(context: FoxyInteractionContext) {
        context.reply {
            embed {
                title = pretty("🎰", context.locale["slots.chart.embed.title"])
                color = Colors.RANDOM
                description = context.locale["slots.chart.embed.description"] + "\n\n" +
                        multipliers.entries.joinToString("\n") { (symbol, multiplier) ->
                            pretty(symbol, "${multiplier}x")
                        }
            }
        }
    }
}