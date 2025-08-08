package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.utils.linkButton
import net.cakeyfox.foxy.interactions.pretty

class DailyExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.reply(true) {
            embed {
                title = pretty(
                    FoxyEmotes.FoxyDaily,
                    context.locale["daily.embed.title"]
                )

                thumbnail = Constants.DAILY_EMOJI
                description = context.locale["daily.embed.description"]
                color = Colors.FOXY_DEFAULT

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