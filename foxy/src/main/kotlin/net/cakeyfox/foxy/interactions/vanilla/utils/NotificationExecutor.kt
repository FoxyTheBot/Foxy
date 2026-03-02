package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.database.data.user.Notifications
import net.cakeyfox.foxy.database.utils.builders.NotificationsBuilder
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class NotificationExecutor(val action: String) : UnleashedCommandExecutor() {
    private data class NotificationConfig(
        val getter: (Notifications?) -> Boolean,
        val updater: (NotificationsBuilder, Boolean) -> Unit,
        val enableMessage: String,
        val disableMessage: String
    )
    
    override suspend fun execute(context: CommandContext) {
        val configs = mapOf(
            "tempban" to NotificationConfig(
                getter = { it?.disableTempBanNotifications ?: false },
                updater = { b, v -> b.disableTempBanNotifications = v },
                enableMessage = context.locale["notifications.tempban.enabled"],
                disableMessage = context.locale["notifications.tempban.disabled"]
            ),

            "birthday" to NotificationConfig(
                getter = { it?.disableBirthdayNotifications ?: false },
                updater = { b, v -> b.disableBirthdayNotifications = v },
                enableMessage = context.locale["notifications.birthday.enabled"],
                disableMessage = context.locale["notifications.birthday.disabled"]
            ),

            "daily_reminder" to NotificationConfig(
                getter = { it?.disableDailyReminderNotifications ?: false },
                updater = { b, v -> b.disableDailyReminderNotifications = v },
                enableMessage = context.locale["notifications.daily_reminder.enabled"],
                disableMessage = context.locale["notifications.daily_reminder.disabled"]
            ),

            "daily_tax" to NotificationConfig(
                getter = { it?.disableInactivityTaxNotifications ?: false },
                updater = { b, v -> b.disableInactivityTaxNotifications = v },
                enableMessage = context.locale["notifications.daily_tax.enabled"],
                disableMessage = context.locale["notifications.daily_tax.disabled"]
            ),

            "upvote" to NotificationConfig(
                getter = { it?.disableUpvoteNotifications ?: false },
                updater = { b, v -> b.disableUpvoteNotifications = v },
                enableMessage = context.locale["notifications.upvote.enabled"],
                disableMessage = context.locale["notifications.upvote.disabled"]
            )
        )
        
        val userData = context.getAuthorData()
        val current = userData.notifications
        val config = configs[action] ?: return
        val disabled = config.getter(current)
        val newValue = !disabled
        val message = if (disabled) {
            config.enableMessage
        } else {
            config.disableMessage
        }

        context.reply(true) {
            content = pretty(FoxyEmotes.FoxyWow, message)
        }

        context.foxy.database.user.updateUser(context.user.id) {
            config.updater(this.notifications, newValue)
        }
    }
}