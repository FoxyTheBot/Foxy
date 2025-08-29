package net.cakeyfox.serializable.data.utils

import kotlinx.serialization.Serializable

@Serializable
data class YouTubeQuery(
    val items: List<Item>
) {
    @Serializable
    data class Item(
        val id: Id
    ) {
        @Serializable
        data class Id(
            val channelId: String? = null
        )
    }
}
