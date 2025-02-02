package net.cakeyfox.serializable.data

import kotlinx.serialization.Serializable
import net.cakeyfox.serializable.database.utils.FoxyConfig


@Serializable
data class CustomGuildInfo(
    val id: Long,
    val name: String,
    val icon: String?,
    val owner: GuildOwner,
    val textChannels: List<String> = emptyList(),
    val voiceChannels: List<String> = emptyList(),
    val roles: List<String> = emptyList(),
    val emojis: List<String> = emptyList(),
    val memberCount: Int = 0,
    val textChannelCount: Int = textChannels.size,
    val voiceChannelCount: Int = voiceChannels.size,
    val roleCount: Int = roles.size,
    val emojiCount: Int = emojis.size,
    val boostCount: Int = 0,
    val splashUrl: String? = null,
    val shardId: Int = 0,
    val createdAt: Long,
    val joinedAt: Long,
    val firstEmojis: List<String> = emptyList(),
    val clusterInfo: FoxyConfig.Cluster
) {
    @Serializable
    data class GuildOwner(
        val id: Long,
        val username: String,
        val discriminator: String,
        val avatar: String?
    )
}