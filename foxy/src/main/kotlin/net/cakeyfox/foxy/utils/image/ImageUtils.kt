@file:Suppress("DEPRECATION")

package net.cakeyfox.foxy.utils.image

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import net.cakeyfox.foxy.image.ImageCacheManager
import net.cakeyfox.serializable.data.ImagePosition
import java.awt.AlphaComposite
import java.awt.Color
import java.awt.Font
import java.awt.Graphics2D
import java.awt.Image
import java.awt.RenderingHints
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

    suspend fun loadAssetFromURL(url: String): BufferedImage {
        return withContext(Dispatchers.IO) {
            try {
                val image = ImageCacheManager.imageCache.getIfPresent(url)
                if (image != null) {
                    return@withContext image
                } else {
                    val downloadedImage = downloadImage(url)
                    ImageCacheManager.imageCache.put(url, downloadedImage)
                    return@withContext downloadedImage
                }
            } catch (e: Exception) {
                logger.error(e) { "Error loading image from $url" }
                BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB)
            }
        }
    }

    private suspend fun downloadImage(url: String): BufferedImage {
        try {
            return readImage(URL(url))
        } catch (e: Exception) {
            logger.error(e) { "Error downloading image from $url" }
            return BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB)
        }
    }


    fun Graphics2D.wrapText(text: String, limit: Int): List<String> {
        val words = text.split(" ")
        val lines = mutableListOf<String>()
        var currentLine = ""

        for (word in words) {
            if ((currentLine + word).length <= limit) {
                currentLine += if (currentLine.isEmpty()) word else " $word"
            } else {
                lines.add(currentLine)
                currentLine = word
            }
        }
        if (currentLine.isNotEmpty()) lines.add(currentLine)
        return lines
    }

    fun Graphics2D.drawTextWithFont(width: Int, height: Int, textConfig: TextConfig.() -> Unit) {
        val config = TextConfig().apply(textConfig)
        this.font = getFont(config.fontFamily, config.fontSize) ?: Font("SansSerif", Font.PLAIN, config.fontSize)
        this.color = config.fontColor
        this.drawString(config.text, (width / config.textPosition.x), (height / config.textPosition.y))
    }

    data class TextConfig(
        var text: String = "",
        var fontSize: Int = 16,
        var fontFamily: String = "SansSerif",
        var fontColor: Color = Color.WHITE,
        var textPosition: ImagePosition = ImagePosition(0f, 0f, null)
    )

    suspend fun loadImageFromResources(directory: String): BufferedImage? = withContext(Dispatchers.IO) {
        ImageIO.read(this::class.java.getResourceAsStream(directory))
    }

    fun createCircularAvatar(original: BufferedImage, size: Int): BufferedImage {
        val avatar = BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB)
        val g2 = avatar.createGraphics()

        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR)
        g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY)

        val mask = BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB)
        val mg = mask.createGraphics()
        mg.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
        mg.color = Color(0, 0, 0, 0)
        mg.fillRect(0, 0, size, size)
        mg.color = Color(0, 0, 0, 255)
        mg.fillOval(0, 0, size, size)
        mg.dispose()

        g2.drawImage(original.getScaledInstance(size, size, Image.SCALE_SMOOTH), 0, 0, null)

        g2.composite = AlphaComposite.getInstance(AlphaComposite.DST_IN)
        g2.drawImage(mask, 0, 0, null)

        g2.dispose()
        return avatar
    }

    private suspend fun readImage(image: URL) = withContext(Dispatchers.IO) { ImageIO.read(image) }!!
}