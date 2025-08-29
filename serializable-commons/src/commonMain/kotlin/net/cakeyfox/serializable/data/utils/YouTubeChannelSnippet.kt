package net.cakeyfox.serializable.data.utils

import kotlinx.serialization.Serializable

@Serializable
data class YouTubeQueryBody(
    val items: List<Item>? = emptyList()
) {
    @Serializable
    data class Item(
        val id: String,
        val snippet: Snippet
    ) {
        @Serializable
        data class Snippet(
            val title: String,
            val description: String,
            val thumbnails: Thumbnails,
        ) {
            @Serializable
            data class Thumbnails(
                val default: Default,
            ) {
                @Serializable
                data class Default(
                    val url: String
                )
            }
        }
    }
}
