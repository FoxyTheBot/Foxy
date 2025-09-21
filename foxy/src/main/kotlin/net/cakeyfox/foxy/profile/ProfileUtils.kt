package net.cakeyfox.foxy.profile

import com.github.benmanes.caffeine.cache.Cache
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.database.data.Badge
import net.cakeyfox.foxy.database.data.FoxyUser
import net.cakeyfox.foxy.database.data.Layout
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.profile.badge.BadgeUtils
import net.cakeyfox.foxy.utils.ClusterUtils.getMemberRolesFromGuildOrCluster
import net.dv8tion.jda.api.entities.User

object ProfileUtils {
    fun formatAboutMe(aboutMe: String, layoutInfo: Layout): String {
        val aboutMeLimit = layoutInfo.profileSettings.aboutme.limit
        val breakLength = layoutInfo.profileSettings.aboutme.breakLength

        return if (aboutMe.length > aboutMeLimit) {
            aboutMe.chunked(breakLength).joinToString("\n")
        } else {
            aboutMe
        }
    }

    suspend fun getBadgeAssets(data: FoxyUser, user: User, context: CommandContext): List<Badge> {
        val defaultBadges = getOrFetchFromCache(
            ProfileCacheManager.badgesCache,
            "default"
        ) {
            context.database.profile.getBadges()
        }

        val roles = context.foxy.getMemberRolesFromGuildOrCluster(
            context.foxy,
            Constants.SUPPORT_SERVER_ID.toLong(),
            user.idLong
        )

        val userBadges = roles.let { BadgeUtils.getBadges(context, it, defaultBadges, data) }

        if (userBadges.isEmpty()) {
            return emptyList()
        }

        return userBadges
    }

    suspend fun <T> getOrFetchFromCache(
        cache: Cache<String, T>,
        key: String,
        fetchFromDb: suspend (String) -> T
    ): T {
        return cache.getIfPresent(key) ?: withContext(Dispatchers.IO) {
            fetchFromDb(key).also { cache.put(key, it) }
        }
    }
}