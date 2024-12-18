package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor

class DailyExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        context.reply(true) {
            embed {
                title = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_DAILY
                    content = context.locale["cakes.daily.embed.title"]
                }

                description = context.locale["cakes.daily.embed.description"]
            }
        }
    }
}