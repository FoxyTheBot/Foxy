package net.cakeyfox.foxy.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.serializable.database.data.Badge
import net.cakeyfox.serializable.database.data.FoxyUser
import net.cakeyfox.serializable.database.data.Layout
import net.cakeyfox.serializable.database.data.Position
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.User
import java.awt.Color
import java.awt.Font
import java.awt.Graphics2D
import java.awt.geom.Ellipse2D
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.net.URL
import java.text.NumberFormat
import java.time.Instant
import java.util.*
import javax.imageio.ImageIO

/*
    * This code is based on the original code:
    * https://github.com/FoxyTheBot/Foxy/blob/master/foxy/parent/src/utils/images/generators/GenerateProfile.ts
    * TODO: Refactor this code to use Kotlin's best practices
 */

class FoxyProfileRender(
    val context: UnleashedCommandContext
) {
    private val width = 1436
    private val height = 884
    private var image: BufferedImage = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
    private var graphics: Graphics2D = image.createGraphics()

    suspend fun create(user: User): ByteArrayInputStream {
        val data = context.db.userUtils.getDiscordUser(user.id)
        val layoutInfo = context.db.profileUtils.getLayout(data.userProfile.layout)
        val backgroundInfo = context.db.profileUtils.getBackground(data.userProfile.background)
        val userAboutMe = formatAboutMe(
            data.userProfile.aboutme ?: "",
            layoutInfo
        )

        val layout = loadImage(Constants.PROFILE_LAYOUT(layoutInfo.filename))
        val background = loadImage(Constants.PROFILE_BACKGROUND(backgroundInfo.filename))
        val marriedCard =
            if (data.marryStatus.marriedWith != null) loadImage(Constants.MARRIED_OVERLAY(data.userProfile.layout)) else null

        drawBackgroundAndLayout(background, layout)
        drawUserDetails(user, data, userAboutMe, layoutInfo, marriedCard, context)
        drawBadges(data, user, layoutInfo)
        drawDecoration(data, layoutInfo)

        return withContext(Dispatchers.IO) {
            val outputStream = ByteArrayOutputStream()
            ImageIO.write(image, "png", outputStream)
            ByteArrayInputStream(outputStream.toByteArray())
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
        graphics.drawImage(background, 0, 0, width, height, null)
        graphics.drawImage(layout, 0, 0, width, height, null)
        graphics.color = Color(116, 3, 123)
        graphics.drawRect(0, 0, width, height)
    }

    private suspend fun drawUserDetails(
        user: User,
        data: FoxyUser,
        userAboutMe: String,
        layoutInfo: Layout,
        marriedCard: BufferedImage?,
        context: UnleashedCommandContext
    ) {
        val fontColor = if (layoutInfo.darkText) Color.BLACK else Color.WHITE

        drawText(
            user.name,
            layoutInfo.profileSettings.fontSize.username,
            layoutInfo.profileSettings.defaultFont,
            fontColor,
            layoutInfo.profileSettings.positions.usernamePosition
        )

        val formattedBalance = NumberFormat.getNumberInstance(Locale("pt", "BR"))
            .format(data.userCakes.balance)

        drawText(
            "Cakes: $formattedBalance",
            layoutInfo.profileSettings.fontSize.cakes,
            layoutInfo.profileSettings.defaultFont,
            fontColor,
            layoutInfo.profileSettings.positions.cakesPosition
        )
        if (data.marryStatus.marriedWith != null) {
            val marriedDateFormatted = context.utils.convertToHumanReadableDate(data.marryStatus.marriedDate!!)

            marriedCard?.let {
                graphics.drawImage(it, 0, 0, width, height, null)
                drawText(
                    "Casado(a) com:",
                    layoutInfo.profileSettings.fontSize.married,
                    layoutInfo.profileSettings.defaultFont,
                    fontColor,
                    layoutInfo.profileSettings.positions.marriedPosition
                )

                val partnerUser = context.jda.retrieveUserById(data.marryStatus.marriedWith!!).complete()

                drawText(
                    partnerUser!!.globalName ?: partnerUser.name,
                    layoutInfo.profileSettings.fontSize.marriedSince,
                    layoutInfo.profileSettings.defaultFont,
                    fontColor,
                    layoutInfo.profileSettings.positions.marriedUsernamePosition
                )
                drawText(
                    "Desde $marriedDateFormatted",
                    layoutInfo.profileSettings.fontSize.marriedSince,
                    layoutInfo.profileSettings.defaultFont,
                    fontColor,
                    layoutInfo.profileSettings.positions.marriedSincePosition
                )
            }
        }

        drawText(
            userAboutMe,
            layoutInfo.profileSettings.fontSize.aboutme,
            layoutInfo.profileSettings.defaultFont,
            fontColor,
            layoutInfo.profileSettings.positions.aboutmePosition
        )
        drawUserAvatar(user, layoutInfo)
    }

    private fun drawText(text: String, fontSize: Int, fontFamily: String, color: Color, position: Position) {
        graphics.font = getSystemFont(fontFamily, fontSize) ?: Font("SansSerif", Font.PLAIN, fontSize)
        graphics.color = color
        graphics.drawString(text, (width / position.x), (height / position.y))
    }

    private fun getSystemFont(fontName: String, fontSize: Int): Font? {
        val ge = java.awt.GraphicsEnvironment.getLocalGraphicsEnvironment()
        val availableFonts = ge.availableFontFamilyNames

        return if (fontName in availableFonts) {
            Font(fontName, Font.PLAIN, fontSize)
        } else {
            println("Warning: Font '$fontName' not found. Falling back to default.")
            null
        }
    }

    private suspend fun drawUserAvatar(user: User, layoutInfo: Layout) {
        val avatarUrl = user.avatarUrl ?: user.defaultAvatarUrl

        val avatar: BufferedImage = loadImage(avatarUrl)

        val arcX = layoutInfo.profileSettings.positions.avatarPosition.arc?.x ?: 125f
        val arcY = layoutInfo.profileSettings.positions.avatarPosition.arc?.y ?: 700f
        val arcRadius = layoutInfo.profileSettings.positions.avatarPosition.arc?.radius ?: 100

        val avatarX = layoutInfo.profileSettings.positions.avatarPosition.x
        val avatarY = layoutInfo.profileSettings.positions.avatarPosition.y

        val clippingShape = arcRadius.times(2).let {
            arcRadius.times(2).let { it1 ->
                Ellipse2D.Float(
                    arcX.minus(arcRadius),
                    arcY.minus(arcRadius),
                    it.toFloat(),
                    it1.toFloat()
                )
            }
        }

        graphics.clip(clippingShape)
        graphics.drawImage(avatar, avatarX.toInt(), avatarY.toInt(), 200, 200, null)
        graphics.clip = null
    }

    // TODO: Fix badges not being drawn correctly
    private suspend fun drawBadges(data: FoxyUser, user: User, layoutInfo: Layout) {
        println("Drawing badges")

        val defaultBadges = context.db.profileUtils.getBadges()

        val member = context.jda.guilds.firstNotNullOfOrNull { guild -> guild.getMember(user) }

        val userBadges = member?.let { getUserBadges(it, defaultBadges, data) }
        if (userBadges != null) {
            if (userBadges.isEmpty()) {
                println("No badges to draw")
                return
            }
        }

        var x = layoutInfo.profileSettings.positions.badgesPosition.x
        var y = layoutInfo.profileSettings.positions.badgesPosition.y

        if (userBadges != null) {
            for (badge in userBadges) {
                val badgeImage = loadImage(Constants.PROFILE_BADGES(badge.asset))
                graphics.drawImage(badgeImage, x.toInt(), y.toInt(), 50, 50, null)
                println("Drawing badge ${badge.id} at $x, $y")

                x += 60
                if (x > 1300) {
                    x = layoutInfo.profileSettings.positions.badgesPosition.x
                    y += 50
                }
            }
        }
    }


    private fun getUserBadges(member: Member, defaultBadges: List<Badge>, data: FoxyUser): List<Badge> {
        val userBadges = mutableListOf<Badge>()

        val roleBadges = member.roles
            .mapNotNull { role -> defaultBadges.find { it.id == role.id } }
        userBadges.addAll(roleBadges)

        println("Role-based badges: ${roleBadges.map { it.id }}")

        val twelveHoursAgo = System.currentTimeMillis() - 12 * 60 * 60 * 1000
        val additionalBadges = listOf(
            BadgeCondition(
                "married",
                data.marryStatus.marriedWith != null
            ),
            BadgeCondition(
                "upvoter",
                data.lastVote?.let {
                    val dateString = it.toString().substringAfter("\$date\": \"").substringBefore("\"")
                    val instant = Instant.parse(dateString)
                    instant.toEpochMilli() >= twelveHoursAgo
                } ?: false
            ),
            BadgeCondition(
                "premium",
                data.userPremium.premiumDate?.let {
                    val dateString = it.toString().substringAfter("\$date\": \"").substringBefore("\"")
                    val instant = Instant.parse(dateString)
                    instant.toEpochMilli() >= System.currentTimeMillis()
                } ?: false
            )
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
            val guild = context.jda.getGuildById(badge.isFromGuild!!)
            val guildMember = guild?.getMember(member.user)

            if (guildMember != null && userBadges.none { it.id == badge.id }) {
                userBadges.add(badge)
            }
        }

        println("Final user badges: ${userBadges.map { it.id }}")
        return userBadges.distinctBy { it.id }.sortedByDescending { it.priority }
    }


    private suspend fun drawDecoration(data: FoxyUser, layoutInfo: Layout) {
        data.userProfile.decoration?.let {
            val decorationImage = loadImage(Constants.PROFILE_DECORATION(it))
            graphics.drawImage(
                decorationImage,
                (width / layoutInfo.profileSettings.positions.decorationPosition.x).toInt(),
                (height / layoutInfo.profileSettings.positions.decorationPosition.y).toInt(),
                200,
                200,
                null
            )
        }
    }

    private suspend fun loadImage(url: String): BufferedImage {
        println(url)
        return withContext(Dispatchers.IO) {
            ImageIO.read(URL(url))
        }
    }
}

data class BadgeCondition(val id: String, val condition: Any)