package net.cakeyfox.foxy.interactions.vanilla.social

import kotlinx.datetime.Instant
import kotlinx.datetime.atStartOfDayIn
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import kotlinx.datetime.toJavaInstant
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.pretty

class BirthdaySetExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val birthdayInput = context.getOption("date", 0, String::class.java)

        if (birthdayInput != null) {
            try {
                val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                val parsedJavaDate = LocalDate.parse(birthdayInput, formatter)

                if (parsedJavaDate.year < 1970) {
                    context.reply(true) {
                        content = pretty(FoxyEmotes.FoxyCake, context.locale["birthday.set.youCantAddDatesBeforeThat"])
                    }

                    return
                }

                val parsedKxDate = kotlinx.datetime.LocalDate(
                    year = parsedJavaDate.year,
                    monthNumber = parsedJavaDate.monthValue,
                    dayOfMonth = parsedJavaDate.dayOfMonth
                )
                val birthdayToInstantKx: Instant = parsedKxDate.atStartOfDayIn(context.foxy.foxyZone)

                context.reply(true) {
                    content = pretty(FoxyEmotes.FoxyCake, context.locale["birthday.set.changed", birthdayInput])
                }

                if (context.getAuthorData().userBirthday == null) {
                    context.database.user.updateUser(context.user.id) {
                        userBirthday.birthday = birthdayToInstantKx
                        userBirthday.lastMessage = null
                        userBirthday.isEnabled = true
                    }
                } else {
                    context.database.user.updateUser(context.user.id) {
                        userBirthday.birthday = birthdayToInstantKx
                    }
                }
            } catch(_: Exception) {
                context.reply {
                    content = pretty(FoxyEmotes.FoxyCry, context.locale["birthday.set.cantSet"])
                }
            }
        }
    }
}