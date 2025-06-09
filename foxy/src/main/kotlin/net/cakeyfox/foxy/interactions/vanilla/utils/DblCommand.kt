package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DblCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("dbl", CommandCategory.UTILS) {
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )

        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)
        subCommand("vote") {
            executor = DblExecutor()
        }
    }

    inner class DblExecutor : FoxySlashCommandExecutor() {
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
}