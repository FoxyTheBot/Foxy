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
                PremiumType.TIER1 -> 200
                PremiumType.TIER2 -> 300
                PremiumType.TIER3 -> 500
                PremiumType.PARTNER -> 600
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
                PremiumType.TIER1 -> 5
                PremiumType.TIER2 -> 10
                PremiumType.TIER3 -> 15
                PremiumType.PARTNER -> 20
                else -> 3
            }
        }

        return 3
    }

    fun canBypassInactivityTax(user: FoxyUser): Boolean {
        if (isUserPremium(user)) {
            return when(getPremiumType(user)) {
                PremiumType.TIER1 -> false
                PremiumType.TIER2 -> true
                PremiumType.TIER3 -> true
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
                PremiumType.TIER1 -> false
                PremiumType.TIER2 -> true
                PremiumType.TIER3 -> true
                PremiumType.PARTNER -> true
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
                PremiumType.TIER1 -> false
                PremiumType.TIER2 -> true
                PremiumType.TIER3 -> true
                PremiumType.PARTNER -> true
                else -> false
            }
        }

        return isEligible
    }

    fun isUserPremium(user: FoxyUser): Boolean {
        val premiumDate = user.userPremium.premiumDate ?: return false
        return Clock.System.now() < premiumDate
    }

    private fun getPremiumType(user: FoxyUser): PremiumType {
        val raw = user.userPremium.premiumType ?: return PremiumType.FREE
        return PremiumType.fromDb(raw)
    }
}