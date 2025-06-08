package net.cakeyfox.foxy.profile

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import net.cakeyfox.foxy.database.data.Background
import net.cakeyfox.foxy.database.data.Badge
import net.cakeyfox.foxy.database.data.Decoration
import net.cakeyfox.foxy.database.data.Layout
import net.cakeyfox.foxy.utils.image.ImageUtils
import java.awt.image.BufferedImage

object ProfileCacheManager {
    val backgroundCache: Cache<String, Background> = Caffeine.newBuilder().build()
    val layoutCache: Cache<String, Layout> = Caffeine.newBuilder().build()
    val badgesCache: Cache<String, List<Badge>> = Caffeine.newBuilder().build()
    val decorationCache: Cache<String, Decoration> = Caffeine.newBuilder().build()
    val imageCache: Cache<String, BufferedImage> = Caffeine.newBuilder()
        .maximumSize(100)
        .build()

    suspend fun loadImageFromCache(url: String): BufferedImage {
        return imageCache.getIfPresent(url) ?: run {
            val image = ImageUtils.loadProfileAssetFromURL(url)
            imageCache.put(url, image)
            image
        }
    }
}