package popup

import kotlinx.serialization.Serializable

@Serializable
data class LorittaMessage(
    val content: String,
    val embed: LorittaEmbed,
)

@Serializable
data class LorittaEmbed(
    val title: String,
    val description: String,
    val color: Int,
    val thumbnail: Image,
    val image: Image,
    val footer: Footer
)

@Serializable
data class Footer(val text: String)
@Serializable
data class Image(val url: String)

