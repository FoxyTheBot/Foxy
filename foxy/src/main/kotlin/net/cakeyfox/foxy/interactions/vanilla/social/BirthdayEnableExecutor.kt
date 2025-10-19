package net.cakeyfox.foxy.interactions.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class BirthdayEnableExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
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
            context.database.user.updateUser(context.user.id) {
                userBirthday.isEnabled = true
                userBirthday.lastMessage = null
                userBirthday.birthday = null
            }
        } else {
            context.database.user.updateUser(context.user.id) {
                userBirthday.isEnabled = !isEnabled
            }
        }
    }
}