package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.utils.linkButton
import net.cakeyfox.foxy.interactions.pretty

class DailyExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.reply(true) {
            embed {
                title = pretty(
                    FoxyEmotes.FoxyDaily,
                    context.locale["daily.embed.title"]
                )

                thumbnail = Constants.DAILY_EMOJI
                description = context.locale["daily.embed.description"]

                actionRow(
                    linkButton(
                        FoxyEmotes.FoxyPetPet,
                        context.locale["daily.embed.redeemDaily"],
                        Constants.DAILY
                    ),

                    linkButton(
                        FoxyEmotes.FoxyDaily,
                        context.locale["daily.embed.buyMore"],
                        Constants.PREMIUM
                    )
                )
            }
        }
    }
}