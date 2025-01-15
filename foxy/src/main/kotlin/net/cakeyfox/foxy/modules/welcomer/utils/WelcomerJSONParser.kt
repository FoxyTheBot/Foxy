package net.cakeyfox.foxy.modules.welcomer.utils

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import net.cakeyfox.common.Placeholders
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.entities.User

class WelcomerJSONParser {
    private val objectMapper = ObjectMapper()

    fun parseDiscordJsonMessage(
        jsonString: String,
        placeholders: Map<String, String?>
    ): Pair<String, List<MessageEmbed>> {
        val rootNode: JsonNode = objectMapper.readTree(jsonString)

        val content = rootNode.get("content")?.asText("")?.let {
            replacePlaceholders(it, placeholders)
        } ?: ""

        val embedsList = rootNode.get("embeds")?.let { embedsNode ->
            if (embedsNode.isArray) {
                embedsNode.mapNotNull { embedObj ->
                    if (embedObj is JsonNode) {
                        EmbedBuilder().apply {
                            embedObj.get("title")?.let { it ->
                                if (!it.isNull) {
                                    it.asText()?.takeIf { it.isNotEmpty() }?.let {
                                        setTitle(replacePlaceholders(it, placeholders))
                                    }
                                }
                            }

                            embedObj.get("description")?.let { it ->
                                if (!it.isNull) {
                                    it.asText()?.takeIf { it.isNotEmpty() }?.let {
                                        setDescription(replacePlaceholders(it, placeholders))
                                    }
                                }
                            }

                            embedObj.get("color")?.asInt()?.takeIf { it != 0 }?.let {
                                setColor(it)
                            }

                            embedObj.get("footer")?.get("text")?.let { it ->
                                if (!it.isNull) {
                                    it.asText()?.takeIf { it.isNotEmpty() }?.let {
                                        setFooter(replacePlaceholders(it, placeholders), null)
                                    }
                                }
                            }

                            embedObj.get("image")?.get("url")?.let { it ->
                                if (!it.isNull) {
                                    it.asText()?.takeIf { it.isNotEmpty() }?.let { url ->
                                        val replacedUrl = replacePlaceholders(url, placeholders)
                                        setImage(replacedUrl)
                                    }
                                }
                            }

                            embedObj.get("thumbnail")?.get("url")?.let { it ->
                                if (!it.isNull) {
                                    it.asText()?.takeIf { it.isNotEmpty() }?.let { url ->
                                        val replacedUrl = replacePlaceholders(url, placeholders)
                                        setThumbnail(replacedUrl)
                                    }
                                }
                            }

                        }.build()
                    } else null
                }
            } else {
                emptyList()
            }
        } ?: emptyList()

        return Pair(content, embedsList)
    }


    fun getPlaceholders(guild: Guild, user: User): Map<String, String?> {
        return mapOf(
            Placeholders.USER_GLOBAL_NAME to user.globalName,
            Placeholders.USER_MENTION to user.asMention,
            Placeholders.USER_USERNAME to user.name,
            Placeholders.USER_ID to user.id,
            Placeholders.GUILD_NAME to guild.name,
            Placeholders.GUILD_ID to guild.id,
            Placeholders.GUILD_MEMBERS to guild.memberCount.toString(),
            Placeholders.USER_AVATAR to user.effectiveAvatarUrl + "?size=2048",
            Placeholders.GUILD_ICON to guild.iconUrl
        )
    }

    private fun replacePlaceholders(message: String, placeholders: Map<String, String?>): String {
        var formattedMessage = message

        placeholders.forEach { (key, value) ->
            formattedMessage = formattedMessage.replace(key, value ?: "")
        }

        return formattedMessage
    }
}