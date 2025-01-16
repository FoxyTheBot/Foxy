package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty

class DailyExecutor: FoxyCommandExecutor() {
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
                    context.foxy.interactionManager.createLinkButton(
                        context.foxy.shardManager.getEmojiById(FoxyEmotes.FoxyPetPet)!!,
                        context.locale["daily.embed.redeemDaily"],
                        Constants.DAILY
                    ),

                    context.foxy.interactionManager.createLinkButton(
                        context.foxy.shardManager.getEmojiById(FoxyEmotes.FoxyDaily)!!,
                        context.locale["daily.embed.buyMore"],
                        Constants.PREMIUM
                    )
                )
            }
        }
    }
}