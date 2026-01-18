package popup

import kotlinx.serialization.Serializable

@Serializable
data class CarlbotMessage(
    val title: String? = null,
    val description: String? = null,
    val image: Image? = null,
    val thumbnail: Image? = null,
    val color: Long? = null,
    val footer: Footer? = null,
)