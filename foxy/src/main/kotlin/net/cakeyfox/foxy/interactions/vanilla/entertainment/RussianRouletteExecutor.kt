package net.cakeyfox.foxy.interactions.vanilla.entertainment

import kotlinx.coroutines.delay
import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor

class RussianRouletteExecutor : CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val totalBullets = (1..4).random()
        val bulletInChamber = (1..totalBullets).random()

        context.reply {
            embed {
                title = context.locale["russianRoulette.embed.title"]
                description = context.locale["russianRoulette.embed.description"]
                color = Colors.ORANGE

                field {
                    name = context.locale["russianRoulette.embed.bullets"]
                    value = "🔫 ".repeat(totalBullets)
                }
            }
        }

        val userBullet = (1..totalBullets).random()
        // Suspense, suspense and more suspense

        delay(2000)
        context.edit {
            embed {
                title = context.locale["russianRoulette.embed.title"]
                description = context.locale["russianRoulette.embed.suspense"]
                color = Colors.RANDOM
            }
        }
        delay(2000)

        context.edit {
            if (userBullet == bulletInChamber) {
                embed {
                    title = context.locale["russianRoulette.embed.title"]
                    description = context.locale["russianRoulette.embed.youDie", bulletInChamber.toString()]
                    color = Colors.RED
                }
            } else {
                embed {
                    title = context.locale["russianRoulette.embed.title"]
                    description = context.locale["russianRoulette.embed.youSurvived", bulletInChamber.toString()]
                    color = Colors.GREEN
                }
            }
        }
    }
}