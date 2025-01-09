package net.cakeyfox.foxy.utils.image

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import net.cakeyfox.foxy.utils.profile.ProfileCacheManager
import net.cakeyfox.serializable.data.ImagePosition
import java.awt.Color
import java.awt.Font
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import java.io.InputStream
import java.net.URL
import javax.imageio.ImageIO
import kotlin.reflect.jvm.jvmName

object ImageUtils {
    private val logger = KotlinLogging.logger(this::class.jvmName)

    fun getFont(fontName: String, fontSize: Int): Font? {
        val fontStream: InputStream? = this::class.java.classLoader.getResourceAsStream("fonts/$fontName.ttf")

        return if (fontStream != null) {
            try {
                Font.createFont(Font.TRUETYPE_FONT, fontStream).deriveFont(Font.PLAIN, fontSize.toFloat())
            } catch (e: Exception) {
                logger.error(e) { "Can't load font $fontName " }
                null
            }
        } else {
            logger.error { "$fontName font not found on resources path" }
            null
        }
    }

    suspend fun loadProfileAssetFromURL(url: String): BufferedImage {
        return withContext(Dispatchers.IO) {
            try {
                ProfileCacheManager.imageCache.get(url) {
                    downloadImage(url)
                }
            } catch (e: Exception) {
                logger.error(e) { "Error loading image from $url" }
                BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB)
            }
        }
    }

    private fun downloadImage(url: String): BufferedImage {
        try {
            val connection = URL(url).openConnection().apply {
                setRequestProperty("User-Agent", "Mozilla/5.0")
                connectTimeout = 5000
                readTimeout = 5000
            }

            return ImageIO.read(connection.inputStream)
        } catch (e: Exception) {
            logger.error(e) { "Error downloading image from $url" }
            return BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB)
        }
    }


    fun Graphics2D.drawTextWithFont(width: Int, height: Int, textConfig: TextConfig.() -> Unit) {
        val config = TextConfig().apply(textConfig)
        this.font = getFont(config.fontFamily, config.fontSize) ?: Font("SansSerif", Font.PLAIN, config.fontSize)
        this.color = color
        this.drawString(config.text, (width / config.textPosition.x), (height / config.textPosition.y))
    }

    data class TextConfig(
        var text: String = "",
        var fontSize: Int = 16,
        var fontFamily: String = "SansSerif",
        var fontColor: Color = Color.WHITE,
        var textPosition: ImagePosition = ImagePosition(0f, 0f, null)
    )
}