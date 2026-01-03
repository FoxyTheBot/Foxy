package net.cakeyfox.foxy.utils

import kotlinx.datetime.Instant
import net.cakeyfox.common.Constants
import net.cakeyfox.common.Placeholders
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.data.website.DiscordServer
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.User

object PlaceholderUtils {
    fun getAllPlaceholders(guild: DiscordServer, user: User): Map<String, String?> {
        return getUserPlaceholders(user) + getGuildPlaceholders(guild)
    }

    fun getYouTubeChannelPlaceholders(channelId: String, videoUrl: String, channelName: String): Map<String, String?> {
        return mapOf(
            Placeholders.CHANNEL_NAME to channelName,
            Placeholders.VIDEO_URL to videoUrl,
            Placeholders.CHANNEL_ID to channelId
        )
    }

    fun getModerationPlaceholders(
        foxy: FoxyInstance,
        staff: User,
        punishedMember: User,
        guild: Guild,
        duration: Instant?,
        reason: String,
        punishmentType: String
    ): Map<String, String?> {
        return mapOf(
            Placeholders.DURATION to if (duration != null) {
                foxy.utils.convertISOToExtendedDiscordTimestamp(duration)
            } else "Permanente",

            Placeholders.STAFF_NAME to staff.name,
            Placeholders.STAFF_ID to staff.id,
            Placeholders.STAFF_MENTION to staff.asMention,
            Placeholders.STAFF_AVATAR to staff.effectiveAvatarUrl + "?size=2048",
            Placeholders.MEMBER_NAME to punishedMember.name,
            Placeholders.MEMBER_AVATAR to punishedMember.avatarUrl,
            Placeholders.MEMBERS_ID to punishedMember.id,
            Placeholders.MEMBER_MENTION to punishedMember.asMention,
            Placeholders.GUILD_NAME to guild.name,
            Placeholders.GUILD_ID to guild.id,
            Placeholders.GUILD_ICON to guild.iconUrl,
            Placeholders.REASON to reason,
            Placeholders.PUNISHMENT_TYPE to punishmentType,
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

    private fun getGuildPlaceholders(guild: DiscordServer): Map<String, String?> {
        val staticImage = "https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128"

        return mapOf(
            Placeholders.GUILD_NAME to guild.name,
            Placeholders.GUILD_ID to guild.id,
            Placeholders.GUILD_ICON to if (guild.icon != null) staticImage else guild.iconUrl
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