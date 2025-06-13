package net.cakeyfox.foxy.utils.leaderboard.utils

import kotlinx.coroutines.coroutineScope
import mu.KotlinLogging
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.utils.image.CustomFonts
import net.cakeyfox.foxy.utils.image.ImageUtils
import net.cakeyfox.foxy.utils.leaderboard.data.LeaderboardConfig
import net.cakeyfox.foxy.utils.leaderboard.data.LeaderboardUser
import java.awt.Color
import java.awt.Graphics2D
import java.awt.RenderingHints
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.net.URL
import javax.imageio.ImageIO
import kotlin.system.measureTimeMillis

class LeaderboardRender(
    private val config: LeaderboardConfig,
    private val context: FoxyInteractionContext
) {
    private lateinit var graphics: Graphics2D
    lateinit var image: BufferedImage

    companion object {
        private val logger = KotlinLogging.logger { }
    }

    suspend fun create(users: List<LeaderboardUser.CakesUser>): ByteArray {
        val renderTime = measureTimeMillis {
            coroutineScope {
                image = BufferedImage(config.width, config.height, BufferedImage.TYPE_INT_ARGB)
                graphics = image.createGraphics()
                graphics.drawImage(
                    ImageUtils.loadImageFromResources("/assets/ranking/foxy.png"),
                    0,
                    0,
                    config.width,
                    config.height,
                    null
                )
                graphics.drawImage(
                    ImageUtils.loadImageFromResources("/assets/ranking/ranking_overlay.png"),
                    0,
                    0,
                    config.width,
                    config.height,
                    null
                )

                graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
                graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)
                graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY)
                graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR)

                val fontUsername = ImageUtils.getFont(CustomFonts.NOTO_SANS_BOLD, 23)
                val fontCakes = ImageUtils.getFont(CustomFonts.NOTO_SANS_REGULAR, 19)

                val avatarSize = 53
                val startXAvatar = 60
                val startXText = startXAvatar + avatarSize + 12
                val startY = 45
                val lineHeight = 68

                graphics.font = ImageUtils.getFont(CustomFonts.NOTO_SANS_BOLD, 24)
                graphics.color = Color.WHITE
                graphics.rotate(-Math.PI / 2)
                graphics.drawString(context.locale["top.cakes.title"], -config.height + 15, 28)
                graphics.rotate(Math.PI / 2)

                users.take(5).forEachIndexed { index, user ->
                    val y = startY + index * lineHeight
                    val avatarUrl = URL(user.avatar)
                    val avatarImage = ImageIO.read(avatarUrl)

                    if (avatarImage != null) {
                        val clippedAvatar = ImageUtils.createCircularAvatar(avatarImage, avatarSize)
                        graphics.drawImage(
                            clippedAvatar, startXAvatar, y - avatarSize + 18,
                            null
                        )
                    }

                    val textStartY = y - 12
                    val lineSpacing = 25

                    val rankColor = when (user.rank) {
                        1 -> Color(0xFFD700)
                        2 -> Color(0xC0C0C0)
                        3 -> Color(0xCD7F32)
                        else -> Color.WHITE
                    }

                    graphics.color = rankColor
                    graphics.font = fontUsername
                    val line1 = "#${user.rank} ${user.username}"
                    graphics.drawString(line1, startXText, textStartY)

                    graphics.color = Color.WHITE
                    graphics.font = fontCakes
                    val line2 = "${user.cakes} Cakes"
                    graphics.drawString(line2, startXText, textStartY + lineSpacing)
                }

            }
        }

        logger.debug { "Leaderboard rendered in ${renderTime}ms" }

        val outputStream = ByteArrayOutputStream()
        ImageIO.write(image, "png", outputStream)
        cleanUp()
        return outputStream.toByteArray()
    }

    private fun cleanUp() {
        graphics.dispose()
        image.flush()
    }
}