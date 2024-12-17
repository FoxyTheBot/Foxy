package net.cakeyfox.foxy.utils

import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.serializable.database.FoxyUser
import net.dv8tion.jda.api.entities.User
import java.awt.Graphics2D
import java.awt.image.BufferedImage

class FoxyProfileRender {
    private val width = 1436
    private val height = 884
    private lateinit var image: BufferedImage
    private lateinit var graphics: Graphics2D

    init {
        image = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
        graphics = image.createGraphics()
    }

    suspend fun create(context: UnleashedCommandContext, data: FoxyUser): ByteArray {
        // TODO: Implement this, also create getLayout and getBackground methods in MongoDBClient

//        val user = context.db.getDiscordUser(context.event.user.id)
//        val layoutInfo = context.db.getLayout(data.userProfile.layout)
//        val backgroundInfo = context.db.getBackground(data.userProfile.background)
//        val userAboutMe = formatAboutMe(data.userProfile.aboutme ?: context.locale, layoutInfo)
//
//        val layout = loadImage(Constants.PROFILE_LAYOUT(layoutInfo.filename))
//        val background = loadImage(Constants.PROFILE_BACKGROUND(backgroundInfo.filename))

        return ByteArray(0)
    }
}