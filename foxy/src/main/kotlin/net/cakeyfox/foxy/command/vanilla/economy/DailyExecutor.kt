package net.cakeyfox.foxy.command.vanilla.economy

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

                description = context.locale["daily.embed.description"]

                actionRow(
                    context.foxy.interactionManager.createLinkButton(
                        context.jda.getEmojiById(FoxyEmotes.FoxyPetPet)!!,
                        context.locale["daily.embed.redeemDaily"],
                        "https://foxybot.win/br/daily"
                    ),

                    context.foxy.interactionManager.createLinkButton(
                        context.jda.getEmojiById(FoxyEmotes.FoxyDaily)!!,
                        context.locale["daily.embed.buyMore"],
                        "https://foxybot.win/br/premium"
                    )
                )
            }
        }
    }
}