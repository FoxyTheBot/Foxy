package net.cakeyfox.foxy.utils.profile

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import net.cakeyfox.serializable.database.data.Background
import net.cakeyfox.serializable.database.data.Badge
import net.cakeyfox.serializable.database.data.Decoration
import net.cakeyfox.serializable.database.data.Layout
import java.awt.image.BufferedImage
import java.io.InputStream
import javax.imageio.ImageIO

object ProfileCacheManager {
    val backgroundCache: Cache<String, Background> = Caffeine.newBuilder().build()
    val layoutCache: Cache<String, Layout> = Caffeine.newBuilder().build()
    val badgesCache: Cache<String, List<Badge>> = Caffeine.newBuilder().build()
    val decorationCache: Cache<String, Decoration> = Caffeine.newBuilder().build()
    val imageCache: Cache<String, BufferedImage> = Caffeine.newBuilder()
        .maximumSize(100)
        .build()

    fun loadImageFromFile(stream: InputStream): BufferedImage = ImageIO.read(stream)
}