package net.cakeyfox.foxy.utils.profile

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.utils.pretty
import net.cakeyfox.serializable.database.data.*
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.exceptions.ErrorResponseException
import java.awt.Color
import java.awt.Font
import java.awt.Graphics2D
import java.awt.RenderingHints
import java.awt.geom.Ellipse2D
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.net.URL
import java.time.Instant
import javax.imageio.ImageIO
import kotlin.reflect.jvm.jvmName

class FoxyProfileRender(
    val context: FoxyInteractionContext
) {
    companion object {
        val backgroundCache: Cache<String, Background> = Caffeine.newBuilder()
            .build()

        val layoutCache: Cache<String, Layout> = Caffeine.newBuilder()
            .build()

        val badgeCache: Cache<String, List<Badge>> = Caffeine.newBuilder()
            .build()

        private val logger = KotlinLogging.logger(this::class.jvmName)
        private const val width = 1436
        private const val height = 884
    }

    private var image: BufferedImage = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
    private var graphics: Graphics2D = image.createGraphics()

    init {
        graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB)
        graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY)
    }

    suspend fun create(user: User): ByteArray? {
        val data = context.db.utils.user.getDiscordUser(user.id)

        if (data.isBanned == true) {
            context.reply {
                embed {
                    title = pretty(FoxyEmotes.FoxyRage, context.locale["profile.isBanned", user.name])
                    color = Colors.RED
                    field {
                        name = pretty(FoxyEmotes.FoxyDrinkingCoffee, context.locale["profile.banReason"])
                        value = data.banReason ?: context.locale["profile.noBanReasonProvided"]
                        inline = false
                    }

                    field {
                        name = pretty(FoxyEmotes.FoxyBan, context.locale["profile.bannedSince"])
                        value = data.banDate?.let { context.utils.convertISOToDiscordTimestamp(it) }.toString()
                        inline = false
                    }
                }
            }

            cleanUp()
            return null
        }

        val layoutInfo = layoutCache.get(data.userProfile.layout) { context.db.utils.profile.getLayout(it) }!!
        val backgroundInfo = backgroundCache.get(data.userProfile.background) { context.db.utils.profile.getBackground(it) }!!
        val userAboutMe = formatAboutMe(data.userProfile.aboutme ?: context.locale["profile.defaultAboutMe"], layoutInfo)

        val layout = loadImage(Constants.PROFILE_LAYOUT(layoutInfo.filename))
        val background = loadImage(Constants.PROFILE_BACKGROUND(backgroundInfo.filename))
        val marriedCard = if (data.marryStatus.marriedWith != null) loadImage(Constants.MARRIED_OVERLAY(data.userProfile.layout)) else null

        drawBackgroundAndLayout(background, layout)
        drawUserDetails(user, data, userAboutMe, layoutInfo, marriedCard, context)
        drawBadges(data, user, layoutInfo)
        drawDecoration(data, layoutInfo)

        cleanUp()
        return withContext(Dispatchers.IO) {
            val outputStream = ByteArrayOutputStream()
            ImageIO.write(image, "png", outputStream)
            outputStream.toByteArray()
        }
    }

    private fun formatAboutMe(aboutMe: String, layoutInfo: Layout): String {
        val limit = layoutInfo.profileSettings.aboutme.limit
        val breakLength = layoutInfo.profileSettings.aboutme.breakLength
        return if (aboutMe.length > limit) {
            aboutMe.chunked(breakLength).joinToString("\n")
        } else {
            aboutMe
        }
    }

    private fun drawBackgroundAndLayout(background: BufferedImage, layout: BufferedImage) {
        graphics.clearRect(0, 0, width, height)
        graphics.drawImage(background, 0, 0, width, height, null)
        graphics.drawImage(layout, 0, 0, width, height, null)
        graphics.drawRect(0, 0, width, height)
    }

    private suspend fun drawUserDetails(
        user: User,
        data: FoxyUser,
        userAboutMe: String,
        layoutInfo: Layout,
        marriedCard: BufferedImage?,
        context: FoxyInteractionContext
    ) {
        val fontColor = if (layoutInfo.darkText) Color.BLACK else Color.WHITE

        drawText(user.name, layoutInfo.profileSettings.fontSize.username, layoutInfo.profileSettings.defaultFont, fontColor, layoutInfo.profileSettings.positions.usernamePosition)

        val formattedBalance = context.utils.formatNumber(data.userCakes.balance, "pt", "BR")
        drawText("Cakes: $formattedBalance", layoutInfo.profileSettings.fontSize.cakes, layoutInfo.profileSettings.defaultFont, fontColor, layoutInfo.profileSettings.positions.cakesPosition)

        if (data.marryStatus.marriedWith != null) {
            val marriedDateFormatted = context.utils.convertToHumanReadableDate(data.marryStatus.marriedDate!!)
            marriedCard?.let {
                graphics.drawImage(it, 0, 0, width, height, null)
                drawText(context.locale["profile.marriedWith"], layoutInfo.profileSettings.fontSize.married, layoutInfo.profileSettings.defaultFont, fontColor, layoutInfo.profileSettings.positions.marriedPosition)

                val partnerUser = context.jda.retrieveUserById(data.marryStatus.marriedWith!!).await()
                drawText(partnerUser.name, layoutInfo.profileSettings.fontSize.marriedSince, layoutInfo.profileSettings.defaultFont, fontColor, layoutInfo.profileSettings.positions.marriedUsernamePosition)
                drawText(context.locale["profile.marriedSince", marriedDateFormatted], layoutInfo.profileSettings.fontSize.marriedSince, layoutInfo.profileSettings.defaultFont, fontColor, layoutInfo.profileSettings.positions.marriedSincePosition)
            }
        }

        drawText(userAboutMe, layoutInfo.profileSettings.fontSize.aboutme, layoutInfo.profileSettings.defaultFont, fontColor, layoutInfo.profileSettings.positions.aboutmePosition)
        drawUserAvatar(user, layoutInfo)
    }

    private fun drawText(text: String, fontSize: Int, fontFamily: String, color: Color, position: Position) {
        graphics.font = getFont(fontFamily, fontSize) ?: Font("SansSerif", Font.PLAIN, fontSize)
        graphics.color = color
        graphics.drawString(text, (width / position.x), (height / position.y))
    }

    private fun getFont(fontName: String, fontSize: Int): Font? {
        val fontStream: InputStream? = this::class.java.classLoader.getResourceAsStream("profile/fonts/$fontName.ttf")

        return if (fontStream != null) {
            try {
                Font.createFont(Font.TRUETYPE_FONT, fontStream).deriveFont(Font.PLAIN, fontSize.toFloat())
            } catch (e: Exception) {
                logger.error(e) { "Can't load font $fontName" }
                null
            }
        } else {
            logger.error { "$fontName font not found on resources path" }
            null
        }
    }

    private suspend fun drawUserAvatar(user: User, layoutInfo: Layout) {
        val avatarUrl = user.avatarUrl ?: user.defaultAvatarUrl
        val avatarWithSize = avatarUrl.plus("?size=2048")
        val avatar: BufferedImage = loadImage(avatarWithSize)

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
    }

    private suspend fun drawBadges(data: FoxyUser, user: User, layoutInfo: Layout) {
        val defaultBadges = badgeCache.get("default") { context.db.utils.profile.getBadges() }!!

        val member = try {
            context.jda.getGuildById(Constants.SUPPORT_SERVER_ID)
                ?.retrieveMemberById(user.id)
                ?.await()
        } catch (e: ErrorResponseException) {
            if (e.errorCode == 10007) {
                null
            } else {
                throw e
            }
        }

        val userBadges = member?.let { getUserBadges(it, defaultBadges, data) } ?: getFallbackBadges(defaultBadges, data)

        if (userBadges.isEmpty()) {
            return
        }

        var x = layoutInfo.profileSettings.positions.badgesPosition.x
        var y = layoutInfo.profileSettings.positions.badgesPosition.y

        for (badge in userBadges) {
            val badgeImage = loadImage(Constants.PROFILE_BADGES(badge.asset))
            graphics.drawImage(badgeImage, x.toInt(), y.toInt(), 50, 50, null)

            x += 60
            if (x > 1300) {
                x = layoutInfo.profileSettings.positions.badgesPosition.x
                y += 50
            }
        }
    }

    private fun getFallbackBadges(defaultBadges: List<Badge>, data: FoxyUser): List<Badge> {
        val userBadges = mutableListOf<Badge>()

        val twelveHoursAgo = System.currentTimeMillis() - 12 * 60 * 60 * 1000
        val additionalBadges = listOf(
            BadgeCondition("married", data.marryStatus.marriedWith != null),
            BadgeCondition("upvoter", data.lastVote?.let {
                val dateString = it.toString().substringAfter("\$date\": \"").substringBefore("\"")
                val instant = Instant.parse(dateString)
                instant.toEpochMilli() >= twelveHoursAgo
            } ?: false),
            BadgeCondition("premium", data.userPremium.premiumDate?.let {
                val dateString = it.toString().substringAfter("\$date\": \"").substringBefore("\"")
                val instant = Instant.parse(dateString)
                instant.toEpochMilli() >= System.currentTimeMillis()
            } ?: false)
        )

        additionalBadges.forEach { condition ->
            if (condition.condition as Boolean) {
                val badge = defaultBadges.find { it.id == condition.id }
                if (badge != null) {
                    userBadges.add(badge)
                }
            }
        }

        return userBadges.distinctBy { it.id }.sortedByDescending { it.priority }
    }

    private fun getUserBadges(member: Member, defaultBadges: List<Badge>, data: FoxyUser): List<Badge> {
        val userBadges = mutableListOf<Badge>()

        val roleBadges = member.roles
            .mapNotNull { role ->
                defaultBadges.find {
                    it.id == role.id
                }
            }
        userBadges.addAll(roleBadges)

        val twelveHoursAgo = System.currentTimeMillis() - 12 * 60 * 60 * 1000
        val additionalBadges = listOf(
            BadgeCondition("married", data.marryStatus.marriedWith != null),
            BadgeCondition("upvoter", data.lastVote?.let {
                val dateString = it.toString().substringAfter("\$date\": \"").substringBefore("\"")
                val instant = Instant.parse(dateString)
                instant.toEpochMilli() >= twelveHoursAgo
            } ?: false),
            BadgeCondition("premium", data.userPremium.premiumDate?.let {
                val dateString = it.toString().substringAfter("\$date\": \"").substringBefore("\"")
                val instant = Instant.parse(dateString)
                instant.toEpochMilli() >= System.currentTimeMillis()
            } ?: false)
        )

        additionalBadges.forEach { condition ->
            if (condition.condition as Boolean) {
                val badge = defaultBadges.find { it.id == condition.id }
                if (badge != null && userBadges.none { it.id == badge.id }) {
                    userBadges.add(badge)
                }
            }
        }

        defaultBadges.filter { it.isFromGuild != null }.forEach { badge ->
            if (userBadges.none {
                    it.id == badge.id || it.isFromGuild == badge.isFromGuild
                }) {
                userBadges.add(badge)
            }
        }

        return userBadges.distinctBy { it.id }.sortedByDescending { it.priority }
    }

    private suspend fun drawDecoration(data: FoxyUser, layoutInfo: Layout) {
        data.userProfile.decoration?.let {
            val decorationImage = loadImage(Constants.PROFILE_DECORATION(it))
            graphics.drawImage(decorationImage, (width / layoutInfo.profileSettings.positions.decorationPosition.x).toInt(), (height / layoutInfo.profileSettings.positions.decorationPosition.y).toInt(), 200, 200, null)
        }
    }

    private suspend fun loadImage(url: String): BufferedImage {
        return withContext(Dispatchers.IO) {
            ImageIO.read(URL(url))
        }
    }

    private fun cleanUp() {
        graphics.dispose()
        image.flush()
    }
}