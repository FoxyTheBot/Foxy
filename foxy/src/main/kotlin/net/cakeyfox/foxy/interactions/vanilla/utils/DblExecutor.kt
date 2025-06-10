package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.utils.linkButton

class DblExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
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