package popup

import kotlinx.serialization.Serializable

@Serializable
data class LorittaMessage(
    val content: String? = null,
    val embed: LorittaEmbed? = null,
)

@Serializable
data class LorittaEmbed(
    val title: String? = null,
    val description: String? = null,
    val color: Int? = null,
    val thumbnail: Image? = null,
    val image: Image? = null,
    val footer: Footer? = null
)

@Serializable
data class Footer(val text: String)
@Serializable
data class Image(val url: String)

