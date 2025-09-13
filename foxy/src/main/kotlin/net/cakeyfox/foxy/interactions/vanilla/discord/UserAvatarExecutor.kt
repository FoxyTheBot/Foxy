package net.cakeyfox.foxy.interactions.vanilla.discord

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.entities.User

class UserAvatarExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java) ?: context.user

        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyYay, context.locale["user.avatar.title", user.effectiveName])
                image = user.effectiveAvatarUrl + "?size=2048"
                color = Colors.FOXY_DEFAULT
                footer(context.locale["user.avatar.userId", user.id])
            }

            actionRow(
                linkButton(
                    emoji = FoxyEmotes.FoxyWow,
                    label = context.locale["user.avatar.showInBrowser"],
                    url = user.effectiveAvatarUrl + "?size=2048"
                )
            )
        }
    }
}