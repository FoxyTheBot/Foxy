package net.cakeyfox.foxy.interactions.vanilla.discord

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.utils.linkButton

class DblExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.reply {
            embed {
                description = context.locale["dbl.embed.description"]
                color = Colors.BLURPLE
            }

            actionRow(
                linkButton(
                    FoxyEmotes.FoxyYay,
                    context.locale["dbl.clickHereToVote"],
                    Constants.UPVOTE_URL
                )
            )
        }
    }
}