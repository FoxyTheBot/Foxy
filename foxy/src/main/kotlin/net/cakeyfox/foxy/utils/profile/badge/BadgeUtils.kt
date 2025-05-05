package net.cakeyfox.foxy.utils.profile.badge

import net.cakeyfox.foxy.database.data.Badge
import net.cakeyfox.foxy.database.data.FoxyUser
import java.time.Instant

object BadgeUtils {
    private val twelveHoursAgo = System.currentTimeMillis() - 12 * 60 * 60 * 1000

    fun getBadges(roles: List<String>, defaultBadges: List<Badge>, data: FoxyUser): List<Badge> {
        val userBadges = mutableListOf<Badge>()

        val roleBadges = roles
            .mapNotNull { role ->
                defaultBadges.find {
                    it.id == role
                }
            }

        userBadges.addAll(roleBadges)

        getAdditionalBadges(data).forEach { condition ->
            if (condition.condition as Boolean) {
                val badge = defaultBadges.find { it.id == condition.id }
                if (badge != null && userBadges.none { it.id == badge.id }) {
                    userBadges.add(badge)
                }
            }
        }

//        defaultBadges.filter { it.isFromGuild != null }.forEach { badge ->
//            if (userBadges.none {
//                    it.id == badge.id || it.isFromGuild == badge.isFromGuild
//                }) {
//                userBadges.add(badge)
//            }
//        }

        return userBadges.distinctBy { it.id }.sortedByDescending { it.priority }
    }

    fun getFallbackBadges(defaultBadges: List<Badge>, userData: FoxyUser): List<Badge> {
        val userBadges = mutableListOf<Badge>()

        getAdditionalBadges(userData).forEach { condition ->
            if (condition.condition as Boolean) {
                val badge = defaultBadges.find { it.id == condition.id }
                if (badge != null) {
                    userBadges.add(badge)
                }
            }
        }

        return userBadges.distinctBy { it.id }.sortedByDescending { it.priority }
    }

    private fun getAdditionalBadges(userData: FoxyUser): List<BadgeCondition> {
        return listOf(
            BadgeCondition("married", userData.marryStatus.marriedWith != null),
            BadgeCondition("upvoter", userData.lastVote?.let {
                val dateString = it.toString().substringAfter("\$date\": \"").substringBefore("\"")
                val instant = Instant.parse(dateString)
                instant.toEpochMilli() >= twelveHoursAgo
            } ?: false),
            BadgeCondition("premium", userData.userPremium.premiumDate?.let {
                val dateString = it.toString().substringAfter("\$date\": \"").substringBefore("\"")
                val instant = Instant.parse(dateString)
                instant.toEpochMilli() >= System.currentTimeMillis()
            } ?: false)
        )

    }
}