package net.cakeyfox.foxy.utils.profile

import com.github.benmanes.caffeine.cache.Cache
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.foxy.database.data.Layout

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