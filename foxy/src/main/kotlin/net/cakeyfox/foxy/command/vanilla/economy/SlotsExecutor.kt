package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty

class SlotsExecutor : FoxyCommandExecutor() {
    companion object {
        private val symbols = listOf("🍒", "🍉", "🍋", "🍀", "💎", "🦊")
        private val multipliers = mapOf(
            "🍒" to 2,
            "🍉" to 3,
            "🍋" to 5,
            "🍀" to 7,
            "💎" to 10,
            "🦊" to 50
        )
    }

    override suspend fun execute(context: FoxyInteractionContext) {
        val amount = context.getOption<Long>("amount") ?: return
        val (result, winnings) = playSlots(amount)
        val userData = context.getAuthorData()

        if (userData.userCakes.balance < amount) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["slots.notEnoughCakes"]
                )
            }

            return
        }

        context.reply {
            embed {
                title = pretty("🎰", context.locale["slots.embed.title"])
                description = "```$result```"
                color = if (winnings > 0) Colors.GREEN else Colors.RED

                if (winnings > 0) {
                    field {
                        name = pretty(
                            FoxyEmotes.FoxyYay,
                            context.locale["slots.embed.winnings"]
                        )
                        value = context.utils.formatUserBalance(
                            winnings,
                            context.locale
                        )
                    }
                } else {
                    field {
                        name = pretty(
                            FoxyEmotes.FoxyCry,
                            context.locale["slots.embed.loss"]
                        )
                        value = context.utils.formatUserBalance(
                            amount,
                            context.locale
                        )
                    }
                }
            }
        }

        if (winnings > 0) {
            context.foxy.mongoClient.utils.user.addCakesToAUser(
                context.user.id,
                winnings - amount
            )
        } else {
            context.foxy.mongoClient.utils.user.removeCakesFromAUser(
                context.user.id,
                amount
            )
        }
    }

    private fun playSlots(bet: Long): Pair<String, Long> {
        val roll = List(3) { symbols.random() }
        val result = "| ${roll.joinToString(" | ")} |"

        val counts = roll.groupingBy { it }.eachCount()

        val winnings = when {
            counts.containsValue(3) -> bet * multipliers[roll[0]]!!
            counts.containsValue(2) -> {
                val matchingSymbol = roll.find { counts[it] == 2 } ?: return result to 0
                bet * (multipliers[matchingSymbol]!! / 2)
            }

            else -> 0
        }

        return result to winnings
    }
}