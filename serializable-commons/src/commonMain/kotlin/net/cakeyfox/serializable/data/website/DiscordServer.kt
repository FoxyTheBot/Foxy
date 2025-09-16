package net.cakeyfox.serializable.data.website

import kotlinx.serialization.Serializable

@Serializable
data class DiscordServer(
    val id: String,
    val name: String,
    val icon: String?,
    val banner: String?,
    val owner: Boolean,
    val permissions: Long,
)
