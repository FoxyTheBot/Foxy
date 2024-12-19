package net.cakeyfox.foxy.utils

import kotlinx.datetime.Instant
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import java.text.NumberFormat
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*

class FoxyUtils(
    val instance: FoxyInstance
) {
    fun convertISOToDiscordTimestamp(iso: Instant): String {
        val convertedDate = iso.epochSeconds.let { "<t:$it:f>" }
        return convertedDate
    }

    fun convertJavaDateToISO(date: Date): Instant {
        return Instant.fromEpochMilliseconds(date.time)
    }

    fun convertToHumanReadableDate(iso: Instant): String {
        iso.let {
            val instant = java.time.Instant.ofEpochMilli(it.toEpochMilliseconds())
            val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                .withZone(ZoneId.systemDefault())

            return formatter.format(instant)
        }
    }

    fun formatNumber(number: Int, language: String, country: String): String {
        return NumberFormat.getNumberInstance(Locale(language, country))
            .format(number)
    }

    suspend fun handleBan(event: SlashCommandInteractionEvent, context: UnleashedCommandContext) {
        val user = context.db.utils.user.getDiscordUser(event.user.id)

        context.reply {
            embed {
                title = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_RAGE
                    content = context.locale["ban.title"]
                }

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
        }
    }
}