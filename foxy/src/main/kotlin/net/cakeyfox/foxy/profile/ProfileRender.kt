package net.cakeyfox.foxy.profile

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.utils.ClusterUtils
import net.cakeyfox.foxy.utils.image.ImageUtils
import net.cakeyfox.foxy.utils.image.ImageUtils.drawTextWithFont
import net.cakeyfox.foxy.profile.ProfileUtils.getOrFetchFromCache
import net.cakeyfox.foxy.profile.badge.BadgeUtils
import net.cakeyfox.foxy.profile.config.ProfileConfig
import net.cakeyfox.foxy.database.data.*
import net.cakeyfox.foxy.utils.ClusterUtils.getMemberRolesFromCluster
import net.dv8tion.jda.api.entities.User
import java.awt.Color
import java.awt.Graphics2D
import java.awt.RenderingHints
import java.awt.geom.Ellipse2D
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO
import kotlin.reflect.jvm.jvmName
import kotlin.system.measureTimeMillis

class ProfileRender(
    private val config: ProfileConfig, private val context: CommandContext
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
                    ProfileCacheManager.layoutCache,
                    userData.userProfile.layout
                ) { layoutKey ->
                    context.database.profile.getLayout(layoutKey)
                }

                val backgroundInfo: Background = getOrFetchFromCache(
                    ProfileCacheManager.backgroundCache,
                    userData.userProfile.background
                ) { backgroundKey ->
                    context.database.profile.getBackground(backgroundKey)
                }

                val layoutDeferred = async {
                    ProfileCacheManager.loadImageFromCache(
                        Constants.getProfileLayout(layoutInfo.filename)
                    )
                }

                val backgroundDeferred = async {
                    ProfileCacheManager.loadImageFromCache(
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
                drawDecoration(userData, layoutInfo)
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

        graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
            text = user.name
            fontFamily = layout.profileSettings.defaultFont
            fontSize = layout.profileSettings.fontSize.username
            fontColor = color
            textPosition = layout.profileSettings.positions.usernamePosition
        }

        if (userData.marryStatus.marriedWith != null) drawMarryInfo(userData, layout)

        val formattedBalance = context.utils.formatUserBalance(
            userData.userCakes.balance.toLong(),
            context.locale,
            false
        )
        graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
            text = formattedBalance
            fontFamily = layout.profileSettings.defaultFont
            fontSize = layout.profileSettings.fontSize.cakes
            fontColor = color
            textPosition = layout.profileSettings.positions.cakesPosition
        }

        val userAboutMe =
            ProfileUtils.formatAboutMe(userData.userProfile.aboutme ?: context.locale["profile.defaultAboutMe"], layout)

        graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
            text = userAboutMe
            fontFamily = layout.profileSettings.defaultFont
            fontSize = layout.profileSettings.fontSize.aboutme
            fontColor = color
            textPosition = layout.profileSettings.positions.aboutmePosition
        }
    }

    private suspend fun drawUserAvatar(user: User, layoutInfo: Layout, data: FoxyUser) {
        coroutineScope {
            val avatarDeferred = async {
                val avatarUrl = user.avatarUrl ?: user.defaultAvatarUrl
                val avatarWithSize = avatarUrl.plus("?size=1024")
                ImageUtils.loadProfileAssetFromURL(avatarWithSize)
            }

            val decorationDeferred = async {
                data.userProfile.decoration?.let {
                    ProfileCacheManager.loadImageFromCache(Constants.getProfileDecoration(it))
                }
            }

            val avatar = avatarDeferred.await()
            val decorationImage = decorationDeferred.await()

            val arcX = layoutInfo.profileSettings.positions.avatarPosition.arc?.x ?: 125f
            val arcY = layoutInfo.profileSettings.positions.avatarPosition.arc?.y ?: 700f
            val arcRadius = layoutInfo.profileSettings.positions.avatarPosition.arc?.radius ?: 100

            val avatarX = layoutInfo.profileSettings.positions.avatarPosition.x
            val avatarY = layoutInfo.profileSettings.positions.avatarPosition.y

            val clippingShape = arcRadius.times(2).let {
                arcRadius.times(2).let { it1 ->
                    Ellipse2D.Float(arcX.minus(arcRadius), arcY.minus(arcRadius), it.toFloat(), it1.toFloat())
                }
            }

            graphics.clip(clippingShape)
            graphics.drawImage(avatar, avatarX.toInt(), avatarY.toInt(), 200, 200, null)
            graphics.clip = null

            decorationImage?.let {
                graphics.drawImage(
                    it,
                    (config.profileWidth / layoutInfo.profileSettings.positions.decorationPosition.x).toInt(),
                    (config.profileHeight / layoutInfo.profileSettings.positions.decorationPosition.y).toInt(),
                    200,
                    200,
                    null
                )
            }
        }
    }

    private suspend fun drawDecoration(data: FoxyUser, layoutInfo: Layout) {
        if (data.userProfile.decoration != null) {
            val decorationInfo = getOrFetchFromCache(
                ProfileCacheManager.decorationCache,
                data.userProfile.decoration!!
            ) { decorationKey ->
                context.database.profile.getDecoration(decorationKey)
            }

            val decorationImage =
                ProfileCacheManager.loadImageFromCache(
                    Constants.getProfileDecoration(
                        decorationInfo.filename.replace(
                            ".png",
                            ""
                        )
                    )
                )
            graphics.drawImage(
                decorationImage,
                (config.profileWidth / layoutInfo.profileSettings.positions.decorationPosition.x).toInt(),
                (config.profileHeight / layoutInfo.profileSettings.positions.decorationPosition.y).toInt(),
                200,
                200,
                null
            )
        }
    }

    private suspend fun drawBadges(data: FoxyUser, user: User, layoutInfo: Layout) {
        val defaultBadges = getOrFetchFromCache(
            ProfileCacheManager.badgesCache,
            "default"
        ) {
            context.database.profile.getBadges()
        }

        val roles = try {
            context.foxy.shardManager.getGuildById(Constants.SUPPORT_SERVER_ID)
                ?.retrieveMember(user)
                ?.await()
                ?.roles
                ?.map { it.id } ?: run {
                logger.info { "Guild not found on this cluster" }
                context.foxy.getMemberRolesFromCluster(context.foxy, Constants.SUPPORT_SERVER_ID.toLong(), user.idLong)
            }
        } catch (_: Exception) {
            null
        }

        val userBadges = roles?.let { BadgeUtils.getBadges(context, it, defaultBadges, data) }
            ?: BadgeUtils.getFallbackBadges(defaultBadges, data)

        if (userBadges.isEmpty()) {
            return
        }

        var x = layoutInfo.profileSettings.positions.badgesPosition.x
        var y = layoutInfo.profileSettings.positions.badgesPosition.y

        for (badge in userBadges) {
            val badgeImage = ProfileCacheManager.loadImageFromCache(Constants.getProfileBadge(badge.asset))
            graphics.drawImage(badgeImage, x.toInt(), y.toInt(), 50, 50, null)

            x += 60
            if (x > 1300) {
                x = layoutInfo.profileSettings.positions.badgesPosition.x
                y += 50
            }
        }
    }

    private suspend fun drawMarryInfo(userData: FoxyUser, layout: Layout) {
        val marriedDateFormatted = context.utils.convertToHumanReadableDate(userData.marryStatus.marriedDate!!)
        val marriedOverlay = ProfileCacheManager.loadImageFromCache(Constants.getMarriedOverlay(layout.id))
        val color = if (layout.darkText) Color.BLACK else Color.WHITE
        val partnerUser = context.jda.retrieveUserById(userData.marryStatus.marriedWith!!).await()

        marriedOverlay.let {
            graphics.drawImage(it, 0, 0, config.profileWidth, config.profileHeight, null)
            graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
                text = context.locale["profile.marriedWith", marriedDateFormatted]
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.married
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedPosition
            }

            graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
                text = partnerUser.name
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.marriedSince
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedUsernamePosition
            }

            graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
                text = context.locale["profile.marriedSince", marriedDateFormatted]
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.marriedSince
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedSincePosition
            }
        }
    }

    private fun drawBackgroundAndLayout(background: BufferedImage, layout: BufferedImage) {
        graphics.clearRect(0, 0, config.profileWidth, config.profileHeight)
        graphics.drawImage(background, 0, 0, config.profileWidth, config.profileHeight, null)
        graphics.drawImage(layout, 0, 0, config.profileWidth, config.profileHeight, null)
    }

    private fun cleanUp() {
        graphics.dispose()
        image.flush()
    }
}