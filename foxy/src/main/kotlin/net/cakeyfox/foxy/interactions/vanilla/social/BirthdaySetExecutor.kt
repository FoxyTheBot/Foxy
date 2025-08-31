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
        val userBirthday = context.getOption("date", 0, String::class.java)

        if (userBirthday != null) {
            try {
                val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                val parsedJavaDate = LocalDate.parse(userBirthday, formatter)

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
                val birthdayToInstantJava = birthdayToInstantKx.toJavaInstant()

                context.reply(true) {
                    content = pretty(FoxyEmotes.FoxyCake, context.locale["birthday.set.changed", userBirthday])
                }

                if (context.getAuthorData().userBirthday == null) {
                    context.database.user.updateUser(
                        context.user.id,
                        mapOf(
                            "userBirthday.birthday" to birthdayToInstantJava,
                            "userBirthday.lastMessage" to null,
                            "userBirthday.isEnabled" to true
                        )
                    )
                } else {
                    context.database.user.updateUser(
                        context.user.id,
                        mapOf(
                            "userBirthday.birthday" to birthdayToInstantJava
                        )
                    )
                }
            } catch(_: Exception) {
                context.reply {
                    content = pretty(FoxyEmotes.FoxyCry, context.locale["birthday.set.cantSet"])
                }
            }
        }
    }
}