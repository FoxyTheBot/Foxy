package net.cakeyfox.serializable.data

import kotlinx.serialization.Serializable

@Serializable
data class ImagePosition(
    val x: Float,
    val y: Float,
    val arc: Arc? = null,
) {
    @Serializable
    data class Arc(
        val x: Float,
        val y: Float,
        val radius: Int,
    )
}