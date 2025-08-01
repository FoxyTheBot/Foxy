package net.cakeyfox.foxy.profile.badge

import net.cakeyfox.foxy.database.data.Badge
import net.cakeyfox.foxy.database.data.FoxyUser
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.utils.ClusterUtils
import java.time.Instant
import kotlin.collections.forEach

object BadgeUtils {
    private val twelveHoursAgo = System.currentTimeMillis() - 12 * 60 * 60 * 1000

    suspend fun getBadges(
        context: FoxyInteractionContext,
        roles: List<String>,
        defaultBadges: List<Badge>,
        data: FoxyUser
    ): List<Badge> {
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

        defaultBadges.filter { it.isFromGuild != null }.forEach { badge ->
            val guildId = badge.isFromGuild!!
            val memberInfo = ClusterUtils.getMemberFromGuild(context.foxy, guildId, context.user.idLong)

            if (memberInfo?.isMember == true && userBadges.none {
                    it.isFromGuild == badge.isFromGuild
                }) {
                userBadges.add(badge)
            }
        }

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