package frontend.htmx.partials

import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import kotlinx.html.div
import kotlinx.html.h2
import kotlinx.html.h4
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.common.LogType
import net.cakeyfox.foxy.database.data.guild.DashboardLog

fun renderAuditLog(
    locale: FoxyLocale,
    entries: List<DashboardLog>
): String {
    return createHTML().div("cirno-card-container") {
        entries.reversed().forEach { entry ->
            div("cirno-card") {
                div("cirno-card-info") {
                    h2("cirno-card-name big-name") {
                        +locale["auditLogEntries.${LogType.fromDb(entry.actionType!!)}"]
                    }

                    h4("cirno-card-details") {
                        +"Autor: ${entry.authorId}"
                    }

                    val date = Instant.fromEpochMilliseconds(entry.date)
                    val localDateTime = date.toLocalDateTime(TimeZone.currentSystemDefault())
                    val dd = localDateTime.dayOfMonth.toString().padStart(2, '0')
                    val mm = localDateTime.monthNumber.toString().padStart(2, '0')
                    val yyyy = localDateTime.year
                    val hh = localDateTime.hour.toString().padStart(2, '0')
                    val min = localDateTime.minute.toString().padStart(2, '0')

                    h4("cirno-card-details") {
                        +"Data: $dd/$mm/$yyyy às $hh:$min"
                    }
                }
            }
        }
    }
}