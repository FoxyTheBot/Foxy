package net.cakeyfox.foxy.utils

import kotlinx.datetime.Clock
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.database.data.user.FoxyUser
import net.cakeyfox.foxy.interactions.commands.CommandContext
import kotlin.time.Duration.Companion.days

object PremiumUtils {
    suspend fun getMaxQueueSize(context: CommandContext): Int {
        val guildKey = context.database.guild.getKeyByGuildId(context.guildId!!) ?: return 100
        val user = context.database.user.getUserByPremiumKey(guildKey.key)

        if (user != null && isUserPremium(user)) {
            return when (getPremiumType(user)) {
                1 -> 200
                2 -> 300
                3 -> 500
                4 -> 600
                else -> 100
            }
        }

        return 100
    }

    suspend fun maximumYouTubeChannels(foxy: FoxyInstance, guildId: String): Int {
        val guildKey = foxy.database.guild.getKeyByGuildId(guildId) ?: return 3
        val user = foxy.database.user.getUserByPremiumKey(guildKey.key)

        if (user != null && isUserPremium(user)) {
            return when (getPremiumType(user)) {
                1 -> 5
                2 -> 10
                3 -> 15
                4 -> 20
                else -> 3
            }
        }

        return 3
    }

    fun canBypassInactivityTax(user: FoxyUser): Boolean {
        if (isUserPremium(user)) {
            return when(getPremiumType(user)) {
                1 -> false
                2 -> true
                3 -> true
                else -> false
            }
        }

        return false
    }

    suspend fun eligibleFor247Mode(context: CommandContext): Boolean {
        val guildKey = context.database.guild.getKeyByGuildId(context.guildId!!) ?: return false
        val user = context.database.user.getUserByPremiumKey(guildKey.key) ?: return false

        if (isUserPremium(user)) {
            return when (getPremiumType(user)) {
                1 -> false
                2 -> true
                3 -> true
                4 -> true
                else -> false
            }
        }

        return false
    }

    suspend fun eligibleForEarlyAccess(context: CommandContext): Boolean {
        val user = context.database.user.getFoxyProfile(context.user.id)
        var isEligible = false

        if (isUserPremium(user)) {
            val premiumType = getPremiumType(user)
            isEligible = when (premiumType) {
                1 -> false
                2 -> true
                3 -> true
                4 -> true
                else -> false
            }
        }

        return isEligible
    }

    fun isUserPremium(user: FoxyUser): Boolean {
        val premiumDate = user.userPremium.premiumDate ?: return false
        return Clock.System.now() < premiumDate
    }

    private fun getPremiumType(user: FoxyUser): Int {
        return PremiumType.entries.find { it.s == user.userPremium.premiumType }?.let {
            when (it) {
                PremiumType.TIER1_LEGACY, PremiumType.TIER1 -> 1
                PremiumType.TIER2_LEGACY, PremiumType.TIER2 -> 2
                PremiumType.TIER3_LEGACY, PremiumType.TIER3 -> 3
                PremiumType.PARTNER -> 4
            }
        } ?: 0
    }
}