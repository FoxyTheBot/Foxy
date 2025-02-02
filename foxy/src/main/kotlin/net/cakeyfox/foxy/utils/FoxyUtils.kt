package net.cakeyfox.foxy.utils

import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.datetime.Instant
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.serializable.data.ActionResponse
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import java.text.NumberFormat
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*

class FoxyUtils(
    val foxy: FoxyInstance
) {
    fun convertISOToDiscordTimestamp(iso: Instant): String {
        val convertedDate = iso.epochSeconds.let { "<t:$it:f> (<:$it:R>" }
        return convertedDate
    }

    fun convertLongToDiscordTimestamp(epoch: Long): String {
        val convertedDate = epoch.let { "<t:$it:f> (<t:$it:R>)" }
        return convertedDate
    }

    fun convertToHumanReadableDate(iso: Instant): String {
        iso.let {
            val instant = java.time.Instant.ofEpochMilli(it.toEpochMilliseconds())
            val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                .withZone(ZoneId.systemDefault())

            return formatter.format(instant)
        }
    }

    fun formatNumber(number: Double, language: String, country: String): String {
        return NumberFormat.getNumberInstance(Locale(language, country))
            .format(number)
    }

    fun formatLongNumber(number: Long, language: String, country: String): String {
        return NumberFormat.getNumberInstance(Locale(language, country))
            .format(number)
    }

    suspend fun getActionImage(action: String): String {
        return withContext(Dispatchers.IO) {
            val response: ActionResponse = try {
                foxy.httpClient.get("https://nekos.life/api/v2/img/$action").body()
            } catch (e: Exception) {
                foxy.httpClient.get("https://cakey.foxybot.win/roleplay/$action").body()
            }

            return@withContext response.url
        }
    }

    suspend fun handleBan(event: SlashCommandInteractionEvent, context: FoxyInteractionContext) {
        val user = context.db.utils.user.getDiscordUser(event.user.id)

        context.reply {
            embed {
                title = pretty(
                    FoxyEmotes.FoxyRage,
                    context.locale["ban.title"]
                )

                description = context.locale["ban.description"]
                field {
                    name = context.locale["ban.field.reason"]
                    value = user.banReason.toString()
                    inline = false
                }

                field {
                    name = context.locale["ban.field.date"]
                    value = user.banDate?.let { convertISOToDiscordTimestamp(it) }.toString()
                    inline = false
                }
            }

            actionRow(
                foxy.interactionManager.createLinkButton(
                    FoxyEmotes.FoxyCake,
                    context.locale["ban.appealButton"],
                    Constants.UNBAN_FORM_URL
                )
            )
        }
    }
}