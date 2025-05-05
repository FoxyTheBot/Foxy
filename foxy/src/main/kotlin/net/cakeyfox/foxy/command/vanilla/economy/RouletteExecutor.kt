package net.cakeyfox.foxy.command.vanilla.economy

import mu.KotlinLogging
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.database.data.Roulette
import net.cakeyfox.foxy.utils.pretty

class RouletteExecutor : FoxyCommandExecutor() {
    companion object {
        private const val SPIN_TIMEOUT = 86_400_000L
        private val prizes = mapOf(
            0 to 0L,
            1 to 2000L,
            2 to 3000L,
            3 to 4000L,
            4 to 5000L,
            5 to 6000L,
            6 to 7000L,
            7 to 8000L,
            8 to 9000L,
            9 to 10000L
        )
        private val logger = KotlinLogging.logger { }
    }

    override suspend fun execute(context: FoxyInteractionContext) {
        val authorData = context.getAuthorData()

        if (authorData.userCakes.balance < 1_000L) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["roulette.notEnoughCakes"])
            }
            return
        }

        val roulette = authorData.roulette ?: initializeRoulette(context)

        if (roulette.availableSpins <= 0) {
            context.reply { content = context.locale["roulette.noSpins"] }
            return
        }

        val lastSpin = roulette.lastSpin ?: 0L
        if (System.currentTimeMillis() - lastSpin < SPIN_TIMEOUT) {
            val remainingTime = (SPIN_TIMEOUT - (System.currentTimeMillis() - lastSpin)).coerceAtLeast(0)
            val timeToSeconds = (System.currentTimeMillis() + remainingTime) / 1000
            val formattedTime = context.utils.convertLongToDiscordTimestamp(timeToSeconds)

            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["roulette.spinTimeout", formattedTime])
            }
            return
        }

        val spinResult = (0..9).random()
        val prize = prizes[spinResult] ?: 0L
        val formattedPrize = context.utils.formatUserBalance(prize, context.locale, true)

        if (prize > 0) {
            context.database.user.addCakesToUser(context.user.id, prize)
            context.reply {
                content = pretty(FoxyEmotes.FoxyYay, context.locale["roulette.spinResultWin", formattedPrize])
            }
        } else {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["roulette.spinResultLose"])
            }
        }

        val newRoulette = roulette.copy(
            availableSpins = roulette.availableSpins - 1,
            lastSpin = System.currentTimeMillis()
        )

        context.database.user.updateUser(
            context.user.id,
            mapOf("roulette" to newRoulette)
        )

        context.database.user.removeCakesFromUser(context.user.id, 1_000L)
    }

    private suspend fun initializeRoulette(context: FoxyInteractionContext): Roulette {
        logger.info { "Initializing roulette for user ${context.user.id}" }
        val newRoulette = Roulette(availableSpins = 5, lastSpin = System.currentTimeMillis())
        context.database.user.updateUser(
            context.user.id,
            mapOf("roulette.roulette" to newRoulette)
        )
        return newRoulette
    }
}