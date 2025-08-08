package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class SlotsChartExecutor : UnleashedCommandExecutor() {
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

    override suspend fun execute(context: CommandContext) {
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