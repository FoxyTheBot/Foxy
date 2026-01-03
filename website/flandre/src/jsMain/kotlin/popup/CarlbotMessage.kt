package popup

import kotlinx.serialization.Serializable

@Serializable
data class CarlbotMessage(
    val title: String,
    val description: String,
    val image: Image,
    val thumbnail: Image,
    val color: Long,
    val footer: Footer,
)