package net.cakeyfox.foxy.utils

import net.cakeyfox.common.Placeholders
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.User

object PlaceholderUtils {
    fun getAllPlaceholders(guild: Guild, user: User): Map<String, String?> {
        return getUserPlaceholders(user) + getGuildPlaceholders(guild)
    }

    fun getYouTubeChannelPlaceholders(channelId: String, videoUrl: String, channelName: String): Map<String, String?> {
        return mapOf(
            Placeholders.CHANNEL_NAME to channelName,
            Placeholders.VIDEO_URL to videoUrl,
            Placeholders.CHANNEL_ID to channelId
        )
    }

    private fun getUserPlaceholders(user: User): Map<String, String?> {
        return mapOf(
            Placeholders.USER_GLOBAL_NAME to user.globalName,
            Placeholders.USER_MENTION to user.asMention,
            Placeholders.USER_USERNAME to user.name,
            Placeholders.USER_ID to user.id,
            Placeholders.USER_AVATAR to user.effectiveAvatarUrl + "?size=2048",
        )
    }

    private fun getGuildPlaceholders(guild: Guild): Map<String, String?> {
        return mapOf(
            Placeholders.GUILD_NAME to guild.name,
            Placeholders.GUILD_ID to guild.id,
            Placeholders.GUILD_MEMBERS to guild.memberCount.toString(),
            Placeholders.GUILD_ICON to guild.iconUrl
        )
    }

    fun replacePlaceholders(text: String, placeholders: Map<String, String?>): String {
        var result = text
        placeholders.forEach { (key, value) ->
            result = result.replace(key, value ?: "")
        }
        return result
    }
}