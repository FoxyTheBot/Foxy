package net.cakeyfox.foxy.command.vanilla.games

import kotlinx.coroutines.delay
import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor

class RussianRouletteExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val totalBullets = (1..4).random()
        val bulletInChamber = (1..totalBullets).random()

        context.reply {
            embed {
                title = "Roleta Russa"
                description = "Você girou o tambor e apontou a arma para si..."
                color = Colors.ORANGE

                field {
                    name = "Balas no tambor"
                    value = "O tambor contém $totalBullets balas."
                }
            }
        }

        val userBullet = (1..totalBullets).random()
        // Suspense, suspense and more suspense

        delay(2000)
        context.edit {
            embed {
                title = "Roleta Russa"
                description = "Você mesmo com medo, puxou o gatilho e..."
                color = Colors.RANDOM
            }
        }
        delay(2000)

        if (userBullet == bulletInChamber) {
            context.edit {
                embed {
                    title = "Roleta Russa"
                    description = "Você morreu! A bala estava na câmara $bulletInChamber."
                    color = Colors.RED
                }
            }
        } else {
            context.edit {
                embed {
                    title = "Roleta Russa"
                    description = "Você sobreviveu! A bala estava na câmara $bulletInChamber."
                    color = Colors.GREEN
                }
            }
        }
    }
}