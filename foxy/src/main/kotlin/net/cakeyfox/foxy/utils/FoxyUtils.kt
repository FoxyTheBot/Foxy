package net.cakeyfox.foxy.utils

import kotlinx.datetime.Instant
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import java.time.ZoneId
import java.time.format.DateTimeFormatter

class FoxyUtils(
    val instance: FoxyInstance
) {
    fun convertISOToDiscordTimestamp(iso: Instant): String {
        val convertedDate = iso.epochSeconds.let { "<t:$it:f>" }
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

    suspend fun handleBan(event: SlashCommandInteractionEvent, context: UnleashedCommandContext) {
        val user = context.db.userUtils.getDiscordUser(event.user.id)

        context.reply {
            embed {
                title = context.makeReply(FoxyEmotes.FOXY_RAGE, context.locale["ban.title"])
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