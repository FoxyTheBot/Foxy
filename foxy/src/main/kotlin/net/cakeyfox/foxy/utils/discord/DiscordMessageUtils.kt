package net.cakeyfox.foxy.utils.discord

import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.utils.PlaceholderUtils
import net.cakeyfox.serializable.data.utils.DiscordMessageBody
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.entities.MessageEmbed

object DiscordMessageUtils {
    private val replacePlaceholders = PlaceholderUtils::replacePlaceholders
    private val logger = KotlinLogging.logger { }
    private val json = Json { ignoreUnknownKeys = true }

    fun getMessageFromJson(
        jsonString: String,
        placeholders: Map<String, String?>
    ): Pair<String, List<MessageEmbed>> {
        try {
            val messageBody = try {
                json.decodeFromString<DiscordMessageBody>(jsonString)
            } catch (_: SerializationException) {
                logger.warn { "Can't process message content, sending as string" }
                DiscordMessageBody(content = jsonString)
            }

            val content = messageBody.content?.let {
                replacePlaceholders(it, placeholders)
            } ?: ""

            val embedsList = messageBody.embeds?.map { embed ->
                EmbedBuilder().apply {
                    embed.title?.let {
                        setTitle(replacePlaceholders(it, placeholders))
                    }

                    embed.description?.let {
                        setDescription(replacePlaceholders(it, placeholders))
                    }

                    embed.color?.let {
                        setColor(it)
                    }

                    embed.fields?.forEach { field ->
                        addField(
                            replacePlaceholders(field.name, placeholders),
                            replacePlaceholders(field.value, placeholders),
                            field.inline
                        )
                    }

                    embed.image?.url?.let {
                        try {
                            setImage(replacePlaceholders(it, placeholders))
                        } catch (_: Exception) {
                            null
                        }
                    }

                    embed.footer?.let {
                        if (it.iconUrl != null) {
                            setFooter(
                                replacePlaceholders(it.text, placeholders),
                                try {
                                    replacePlaceholders(it.iconUrl ?: Constants.DISCORD_DEFAULT_AVATAR, placeholders)
                                } catch (_: Exception) {
                                    null
                                }
                            )
                        } else {
                            setFooter(replacePlaceholders(it.text, placeholders), null)
                        }
                    }

                    embed.thumbnail?.url?.let {
                        try {
                            setThumbnail(replacePlaceholders(it, placeholders))
                        } catch (_: Exception) {
                        }
                    }
                }.build()
            } ?: emptyList()

            return Pair(content, embedsList)
        } catch (e: Exception) {
            logger.error(e) { "Error parsing JSON message" }
            return Pair("", emptyList())
        }
    }
}