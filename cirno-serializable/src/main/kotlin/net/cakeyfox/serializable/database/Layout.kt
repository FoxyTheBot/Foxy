package net.cakeyfox.serializable.database

import kotlinx.serialization.Serializable

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
    val avatarPosition: Position,
    val usernamePosition: Position,
    val aboutmePosition: Position,
    val marriedPosition: Position,
    val marriedSincePosition: Position,
    val marriedUsernamePosition: Position,
    val badgesPosition: Position,
    val decorationPosition: Position,
    val cakesPosition: Position,
)

@Serializable
data class Position(
    val x: Float,
    val y: Float,
    val arc: Arc ? = null,
)

@Serializable
data class Arc(
    val x: Float,
    val y: Float,
    val radius: Int,
)