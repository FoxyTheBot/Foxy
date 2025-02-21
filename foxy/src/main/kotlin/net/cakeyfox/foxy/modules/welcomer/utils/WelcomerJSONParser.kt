package net.cakeyfox.foxy.modules.welcomer.utils

import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.foxy.utils.PlaceholderUtils
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.entities.MessageEmbed

class WelcomerJSONParser {
    companion object {
        private val replacePlaceholders = PlaceholderUtils::replacePlaceholders
        private val logger = KotlinLogging.logger { }
        private val json = Json { ignoreUnknownKeys = true }
    }

    fun getMessageFromJson(
        jsonString: String,
        placeholders: Map<String, String?>
    ): Pair<String, List<MessageEmbed>> {
        try {
            val messageBody = json.decodeFromString<DiscordMessageBody>(jsonString)

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
                        } catch (e: Exception) {
                            null
                        }
                    }

                    embed.footer?.let {
                        if (it.iconUrl != null) {
                            setFooter(
                                replacePlaceholders(it.text, placeholders),
                                try {
                                    replacePlaceholders(it.iconUrl, placeholders)
                                } catch (e: Exception) {
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
                        } catch (e: Exception) {
                            null
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