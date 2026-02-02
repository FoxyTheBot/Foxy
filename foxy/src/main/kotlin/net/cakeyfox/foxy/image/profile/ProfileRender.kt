package net.cakeyfox.foxy.image.profile

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.common.Constants.getProfileDecoration
import net.cakeyfox.foxy.database.common.data.marry.Marry
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.utils.image.ImageUtils
import net.cakeyfox.foxy.utils.image.ImageUtils.drawTextWithFont
import net.cakeyfox.foxy.image.profile.ProfileUtils.getOrFetchFromCache
import net.cakeyfox.foxy.image.profile.badge.BadgeUtils
import net.cakeyfox.foxy.image.ImageConfig
import net.cakeyfox.foxy.database.data.profile.Background
import net.cakeyfox.foxy.database.data.profile.Layout
import net.cakeyfox.foxy.database.data.user.FoxyUser
import net.cakeyfox.foxy.image.ImageCacheManager
import net.cakeyfox.foxy.utils.ClusterUtils.getMemberRolesFromGuildOrCluster
import net.cakeyfox.foxy.utils.image.ImageUtils.wrapText
import net.dv8tion.jda.api.entities.User
import java.awt.Color
import java.awt.Graphics2D
import java.awt.RenderingHints
import java.awt.geom.Ellipse2D
import java.awt.geom.Rectangle2D
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO
import kotlin.reflect.jvm.jvmName
import kotlin.system.measureTimeMillis

class ProfileRender(
    private val config: ImageConfig, private val context: CommandContext
) {
    private lateinit var graphics: Graphics2D
    lateinit var image: BufferedImage

    companion object {
        private val logger = KotlinLogging.logger(this::class.jvmName)
    }

    suspend fun create(user: User, userData: FoxyUser): ByteArray {
        val renderTime = measureTimeMillis {
            coroutineScope {
                val layoutInfo: Layout = getOrFetchFromCache(
                    ImageCacheManager.layoutCache,
                    userData.userProfile.layout
                ) { layoutKey ->
                    context.database.profile.getLayout(layoutKey)!!
                }

                val backgroundInfo: Background = getOrFetchFromCache(
                    ImageCacheManager.backgroundCache,
                    userData.userProfile.background
                ) { backgroundKey ->
                    context.database.profile.getBackground(backgroundKey)!!
                }

                val layoutDeferred = async {
                    ImageCacheManager.loadImageFromCache(
                        Constants.getProfileLayout(layoutInfo.filename)
                    )
                }

                val backgroundDeferred = async {
                    ImageCacheManager.loadImageFromCache(
                        Constants.getProfileBackground(backgroundInfo.filename)
                    )
                }

                val layout = layoutDeferred.await()
                val background = backgroundDeferred.await()

                image = BufferedImage(
                    layout.width,
                    layout.height,
                    BufferedImage.TYPE_INT_ARGB
                )
                graphics = image.createGraphics()
                graphics.setRenderingHint(
                    RenderingHints.KEY_TEXT_ANTIALIASING,
                    RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB
                )
                graphics.setRenderingHint(
                    RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY
                )

                drawBackgroundAndLayout(background, layout)
                drawUserDetails(user, userData, layoutInfo, context)
                drawBadges(userData, user, layoutInfo)
                drawUserAvatar(user, layoutInfo, userData)
                cleanUp()
            }
        }

        logger.info { "Profile rendered in ${renderTime}ms" }

        val outputStream = ByteArrayOutputStream()
        ImageIO.write(image, "png", outputStream)
        return outputStream.toByteArray()
    }

    private suspend fun drawUserDetails(
        user: User,
        userData: FoxyUser,
        layout: Layout,
        context: CommandContext
    ) {
        val color = if (layout.darkText) Color.BLACK else Color.WHITE

        graphics.drawTextWithFont(config.imageWidth, config.imageHeight) {
            text = user.name
            fontFamily = layout.profileSettings.defaultFont
            fontSize = layout.profileSettings.fontSize.username
            fontColor = color
            textPosition = layout.profileSettings.positions.usernamePosition
        }

        val marriageInfo = context.database.user.getMarriage(user.id)
        if (marriageInfo != null) drawMarryInfo(userData, layout, marriageInfo)

        val formattedBalance = context.utils.formatUserBalance(
            userData.userCakes.balance.toLong(),
            context.locale,
            false
        )
        graphics.drawTextWithFont(config.imageWidth, config.imageHeight) {
            text = formattedBalance
            fontFamily = layout.profileSettings.defaultFont
            fontSize = layout.profileSettings.fontSize.cakes
            fontColor = color
            textPosition = layout.profileSettings.positions.cakesPosition
        }

        val rawAboutMe = userData.userProfile.aboutme ?: context.locale["profile.defaultAboutMe"]
        val aboutMeLines = graphics.wrapText(rawAboutMe, layout.profileSettings.aboutme.limit)

        aboutMeLines.forEachIndexed { index, lineText ->
            graphics.drawTextWithFont(config.imageWidth, config.imageHeight) {
                text = lineText
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.aboutme
                fontColor = color

                val originalPos = layout.profileSettings.positions.aboutmePosition
                val currentPixelY = config.imageHeight / originalPos.y
                val newLinePixelY = currentPixelY + (index * (fontSize * 1.2))
                val dynamicY = config.imageHeight / newLinePixelY

                textPosition = originalPos.copy(
                    x = originalPos.x,
                    y = dynamicY.toFloat()
                )
            }
        }
    }

    private suspend fun drawUserAvatar(user: User, layoutInfo: Layout, data: FoxyUser) {
        coroutineScope {
            val avatarDeferred = async {
                val avatarUrl = user.avatarUrl ?: user.defaultAvatarUrl
                val avatarWithSize = avatarUrl.plus("?size=1024")
                ImageUtils.loadAssetFromURL(avatarWithSize)
            }

            val decorationDeferred = async {
                data.userProfile.decoration?.let {
                    if (it.isNotEmpty()) {
                        ImageCacheManager.loadImageFromCache(getProfileDecoration(it))
                    } else null
                }
            }

            val avatar = avatarDeferred.await()
            val decorationImage = decorationDeferred.await()

            val avatarSize = layoutInfo.profileSettings.fontSize.avatarSize ?: 200f
            val avatarX = layoutInfo.profileSettings.positions.avatarPosition.x
            val avatarY = layoutInfo.profileSettings.positions.avatarPosition.y

            val arc = layoutInfo.profileSettings.positions.avatarPosition.arc
            val arcRadius = arc?.radius?.toFloat() ?: 100f

            val arcX = arc?.x ?: (avatarX + avatarSize / 2f)
            val arcY = arc?.y ?: (avatarY + avatarSize / 2f)

            val clippingShape = if (arcRadius > 0f) {
                val diameter = arcRadius * 2f
                Ellipse2D.Float(
                    arcX - arcRadius,
                    arcY - arcRadius,
                    diameter,
                    diameter
                )
            } else {
                Rectangle2D.Float(
                    avatarX,
                    avatarY,
                    avatarSize,
                    avatarSize
                )
            }

            val oldClip = graphics.clip
            graphics.clip = clippingShape

            graphics.drawImage(
                avatar,
                avatarX.toInt(),
                avatarY.toInt(),
                avatarSize.toInt(),
                avatarSize.toInt(),
                null
            )

            val decorationX = layoutInfo.profileSettings.positions.avatarPosition.x - 1
            val decorationY = layoutInfo.profileSettings.positions.avatarPosition.y - (avatarSize * 0.35)
            graphics.clip = oldClip

            decorationImage?.let {
                graphics.drawImage(
                    it,
                    decorationX.toInt(),
                    decorationY.toInt(),
                    avatarSize.toInt(),
                    avatarSize.toInt(),
                    null
                )
            }
        }
    }

    private suspend fun drawBadges(data: FoxyUser, user: User, layoutInfo: Layout) {
        val defaultBadges = getOrFetchFromCache(
            ImageCacheManager.badgesCache,
            "default"
        ) { context.database.profile.getBadges() }

        val roles = context.foxy.getMemberRolesFromGuildOrCluster(
            context.foxy,
            Constants.SUPPORT_SERVER_ID.toLong(),
            user.idLong
        )

        val userBadges = roles.let { BadgeUtils.getBadges(context, it, defaultBadges, data) }

        if (userBadges.isEmpty()) return

        var x = layoutInfo.profileSettings.positions.badgesPosition.x
        var y = layoutInfo.profileSettings.positions.badgesPosition.y

        for (badge in userBadges) {
            val badgeImage = ImageCacheManager.loadImageFromCache(Constants.getProfileBadge(badge.asset))
            graphics.drawImage(badgeImage, x.toInt(), y.toInt(), 50, 50, null)

            x += 60
            if (x > 1300) {
                x = layoutInfo.profileSettings.positions.badgesPosition.x
                y += 50
            }
        }
    }

    private suspend fun drawMarryInfo(userData: FoxyUser, layout: Layout, marriageInfo: Marry) {
        val marriedDateFormatted = context.utils.convertToHumanReadableDate(marriageInfo.marriedDate!!)
        val marriedOverlay = ImageCacheManager.loadImageFromCache(Constants.getMarriedOverlay(layout.id))
        val color = if (layout.darkText) Color.BLACK else Color.WHITE
        val partnerUser = if (marriageInfo.firstUser.id == userData._id) {
            context.jda.retrieveUserById(marriageInfo.secondUser.id).await()
        } else {
            context.jda.retrieveUserById(marriageInfo.firstUser.id).await()
        }

        marriedOverlay.let {
            graphics.drawImage(it, 0, 0, config.imageWidth, config.imageHeight, null)
            graphics.drawTextWithFont(config.imageWidth, config.imageHeight) {
                text = context.locale["profile.marriedWith", marriedDateFormatted]
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.married
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedPosition
            }

            graphics.drawTextWithFont(config.imageWidth, config.imageHeight) {
                text = partnerUser.name
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.marriedSince
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedUsernamePosition
            }

            graphics.drawTextWithFont(config.imageWidth, config.imageHeight) {
                text = context.locale["profile.marriedSince", marriedDateFormatted]
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.marriedSince
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedSincePosition
            }
        }
    }

    private fun drawBackgroundAndLayout(background: BufferedImage, layout: BufferedImage) {
        graphics.clearRect(0, 0, config.imageWidth, config.imageHeight)
        graphics.drawImage(background, 0, 0, config.imageWidth, config.imageHeight, null)
        graphics.drawImage(layout, 0, 0, config.imageWidth, config.imageHeight, null)
    }

    private fun cleanUp() {
        graphics.dispose()
        image.flush()
    }
}