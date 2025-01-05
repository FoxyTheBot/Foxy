package net.cakeyfox.serializable.database.data

import kotlinx.serialization.Serializable
import net.cakeyfox.serializable.data.ImagePosition

@Serializable
data class Layout(
    val id: String,
    val name: String,
    val filename: String,
    val description: String? = null,
    val cakes: Int,
    val inactive: Boolean = false,
    val author: String? = null,
    val darkText: Boolean = false,
    val profileSettings: ProfileSettings,
)

@Serializable
data class ProfileSettings(
    val defaultFont: String,
    val aboutme: AboutMe,
    val fontSize: FontSize,
    val positions: Positions,
)

@Serializable
data class AboutMe(
    val limit: Int,
    val breakLength: Int,
)

@Serializable
data class FontSize(
    val cakes: Int,
    val username: Int,
    val married: Int,
    val marriedSince: Int,
    val aboutme: Int,
)

@Serializable
data class Positions(
    val avatarPosition: ImagePosition,
    val usernamePosition: ImagePosition,
    val aboutmePosition: ImagePosition,
    val marriedPosition: ImagePosition,
    val marriedSincePosition: ImagePosition,
    val marriedUsernamePosition: ImagePosition,
    val badgesPosition: ImagePosition,
    val decorationPosition: ImagePosition,
    val cakesPosition: ImagePosition,
)

