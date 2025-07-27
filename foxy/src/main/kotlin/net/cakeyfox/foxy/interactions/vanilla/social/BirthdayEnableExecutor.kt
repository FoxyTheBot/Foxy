package net.cakeyfox.foxy.interactions.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class BirthdayEnableExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val userData = context.getAuthorData()
        val isEnabled = userData.userBirthday?.isEnabled ?: false
        val message: String = when (!isEnabled) {
            true -> pretty(FoxyEmotes.FoxyOk, context.locale["birthday.enable.enabled"])
            false -> pretty(FoxyEmotes.FoxyOk, context.locale["birthday.enable.disabled"])
        }

        context.reply(true) {
            content = message
        }

        if (userData.userBirthday == null) {
            context.database.user.updateUser(
                context.user.id,
                mapOf(
                    "userBirthday.birthday" to null,
                    "userBirthday.lastMessage" to null,
                    "userBirthday.isEnabled" to true
                )
            )
        } else {
            context.database.user.updateUser(
                context.user.id,
                mapOf("userBirthday.isEnabled" to !isEnabled)
            )
        }
    }
}