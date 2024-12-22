package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor

class DailyExecutor: FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.reply(true) {
            embed {
                title = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_DAILY
                    content = context.locale["daily.embed.title"]
                }

                description = context.locale["daily.embed.description"]

                actionRow(
                    context.instance.interactionManager.createLinkButton(
                        context.jda.getEmojiById(FoxyEmotes.FOXY_PETPET)!!,
                        context.locale["daily.embed.redeemDaily"],
                        "https://foxybot.win/br/daily"
                    ),

                    context.instance.interactionManager.createLinkButton(
                        context.jda.getEmojiById(FoxyEmotes.FOXY_DAILY)!!,
                        context.locale["daily.embed.buyMore"],
                        "https://foxybot.win/br/premium"
                    )
                )
            }
        }
    }
}