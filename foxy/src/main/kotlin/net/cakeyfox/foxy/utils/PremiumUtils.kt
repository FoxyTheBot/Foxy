package net.cakeyfox.foxy.utils

import kotlinx.datetime.Clock
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.database.data.FoxyUser
import kotlin.time.Duration.Companion.days

object PremiumUtils {
    suspend fun eligibleForEarlyAccess(context: FoxyInteractionContext): Boolean {
        val user = context.database.user.getFoxyProfile(context.user.id)
        var isEligible = false

        if (isUserPremium(user)) {
            val premiumType = getPremiumType(user)
            isEligible = when (premiumType) {
                1 -> false
                2 -> true
                3 -> true
                else -> false
            }
        }

        return isEligible
    }

    private fun isUserPremium(user: FoxyUser): Boolean {
        val premiumSince = user.userPremium.premiumDate?.epochSeconds ?: return false
        return premiumSince + 30.days.inWholeSeconds > Clock.System.now().epochSeconds
    }

    private fun getPremiumType(user: FoxyUser): Int {
        return PremiumType.entries.find { it.s == user.userPremium.premiumType }?.let {
            when (it) {
                PremiumType.TIER1_LEGACY, PremiumType.TIER1 -> 1
                PremiumType.TIER2_LEGACY, PremiumType.TIER2 -> 2
                PremiumType.TIER3_LEGACY, PremiumType.TIER3 -> 3
            }
        } ?: 0
    }
}