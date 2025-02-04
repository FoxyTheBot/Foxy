package net.cakeyfox.foxy.command.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor

class DblExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.reply {
            embed {
                description = context.locale["dbl.embed.description"]
                color = Colors.BLURPLE
            }

            actionRow(
                context.foxy.interactionManager.createLinkButton(
                    FoxyEmotes.FoxyYay,
                    context.locale["dbl.clickHereToVote"],
                    Constants.UPVOTE_URL
                )
            )
        }
    }
}