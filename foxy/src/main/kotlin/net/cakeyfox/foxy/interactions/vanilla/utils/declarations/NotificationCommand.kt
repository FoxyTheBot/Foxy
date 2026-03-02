package net.cakeyfox.foxy.interactions.vanilla.utils.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.utils.NotificationExecutor

class NotificationCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("notifications", CommandCategory.UTILS) {
        subCommand("tempban") {
            executor = NotificationExecutor(this.name)
        }

        subCommand("daily_reminder") {
            executor = NotificationExecutor(this.name)
        }

        subCommand("daily_tax") {
            executor = NotificationExecutor(this.name)
        }

        subCommand("upvote") {
            executor = NotificationExecutor(this.name)
        }
    }
}