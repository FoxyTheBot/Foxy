package net.cakeyfox.foxy.interactions.vanilla.moderation

import dev.minn.jda.ktx.messages.InlineMessage
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.AdminUtils
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.entities.User

class UnbanExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.reply {
            buildMessage(context)
        }
    }

    private fun InlineMessage<*>.buildMessage(context: CommandContext, buttonDisabled: Boolean = false) {
        val user = context.getOption("user", 0, User::class.java)!!
        val reason = context.getOption("reason", 0, String::class.java)
        val simplifiedUser = "`@${user.name} (${user.id})`"

        content = pretty(
            FoxyEmotes.FoxyBan,
            context.locale[
                "unban.areYouSure",
                simplifiedUser
            ]
        )

        actionRow(
            context.foxy.interactionManager.createButtonForUser(
                targetUser = context.user,
                style = ButtonStyle.SUCCESS,
                emoji = FoxyEmotes.FoxyPlush,
                label = "Desbanir"
            ) {
                it.edit {
                    buildMessage(context, true)
                }

                val response = AdminUtils.unbanUser(
                    context,
                    user,
                    reason ?: "Motivo não informado",
                    context.user
                )

                if (response) {
                    context.reply(true) {
                        content = pretty(
                            FoxyEmotes.FoxyWow,
                            context.locale[
                                "unban.userUnbanned",
                                simplifiedUser
                            ]
                        )
                    }
                } else {
                    context.reply(true) {
                        content = pretty(
                            FoxyEmotes.FoxyCry,
                            context.locale[
                                "unban.cantUnbanUser",
                                simplifiedUser
                            ]
                        )
                    }
                }
            }.withDisabled(buttonDisabled)
        )
    }
}