package net.cakeyfox.foxy.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.serializable.database.FoxyUser
import net.cakeyfox.serializable.database.Layout
import net.cakeyfox.serializable.database.Position
import net.dv8tion.jda.api.entities.User
import java.awt.Color
import java.awt.Font
import java.awt.Graphics2D
import java.awt.geom.Ellipse2D
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.net.URL
import javax.imageio.ImageIO

/*
    * This code is based on the original code:
    * https://github.com/FoxyTheBot/Foxy/blob/master/foxy/parent/src/utils/images/generators/GenerateProfile.ts
    * TODO: Refactor this code to use Kotlin's best practices and add methods to render badges and fix font
 */

class FoxyProfileRender {
    private val width = 1436
    private val height = 884
    private var image: BufferedImage
    private var graphics: Graphics2D

    init {
        image = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
        graphics = image.createGraphics()
    }

    suspend fun create(context: UnleashedCommandContext, user: User): ByteArrayInputStream {
        val data = context.db.userUtils.getDiscordUser(user.id)
        val layoutInfo = context.db.profileUtils.getLayout(data.userProfile.layout)
        val backgroundInfo = context.db.profileUtils.getBackground(data.userProfile.background)
        val userAboutMe = formatAboutMe(
            data.userProfile.aboutme ?: "",
            layoutInfo
        )

        val layout = loadImage(Constants.PROFILE_LAYOUT(layoutInfo.filename))
        val background = loadImage(Constants.PROFILE_BACKGROUND(backgroundInfo.filename))
        val marriedCard = if (data.marryStatus.marriedWith != null) loadImage(Constants.MARRIED_OVERLAY(data.userProfile.layout)) else null

        drawBackgroundAndLayout(background, layout)
        drawUserDetails(user, data, userAboutMe, layoutInfo, marriedCard, context)

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

    private suspend fun drawUserDetails(user: User, data: FoxyUser, userAboutMe: String, layoutInfo: Layout, marriedCard: BufferedImage?, context: UnleashedCommandContext) {
        val fontColor = if (layoutInfo.darkText) Color.BLACK else Color.WHITE

        drawText (
            user.name,
            layoutInfo.profileSettings.fontSize.username,
            layoutInfo.profileSettings.defaultFont,
            fontColor,
            layoutInfo.profileSettings.positions.usernamePosition
        )

        drawText(
            "Cakes: ${data.userCakes.balance}",
            layoutInfo.profileSettings.fontSize.cakes,
            layoutInfo.profileSettings.defaultFont,
            fontColor,
            layoutInfo.profileSettings.positions.cakesPosition
        )
        marriedCard?.let {
            graphics.drawImage(it, 0, 0, width, height, null)
            drawText(
                "Casado(a) com:",
                layoutInfo.profileSettings.fontSize.married,
                layoutInfo.profileSettings.defaultFont,
                fontColor,
                layoutInfo.profileSettings.positions.marriedPosition
            )

            val partnerUser = context.jda.getUserById(data.marryStatus.marriedWith!!)

            drawText(
                partnerUser?.name ?: "Unknown",
                layoutInfo.profileSettings.fontSize.marriedSince,
                layoutInfo.profileSettings.defaultFont,
                fontColor,
                layoutInfo.profileSettings.positions.marriedUsernamePosition

            )
            drawText(
                "Desde ${data.marryStatus.marriedDate}",
                layoutInfo.profileSettings.fontSize.marriedSince,
                layoutInfo.profileSettings.defaultFont,
                fontColor,
                layoutInfo.profileSettings.positions.marriedSincePosition
            )
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
        graphics.font = Font(fontFamily, Font.PLAIN, fontSize)
        graphics.color = color
        graphics.drawString(text, (width / position.x), (height / position.y))
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

    private suspend fun loadImage(url: String): BufferedImage {
        println(url)
        return withContext(Dispatchers.IO) {
            ImageIO.read(URL(url))
        }
    }
}