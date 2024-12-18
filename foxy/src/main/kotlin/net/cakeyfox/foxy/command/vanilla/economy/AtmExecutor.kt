package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import java.text.NumberFormat
import java.util.Locale

class AtmExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        val user = context.event.getOption("user")?.asUser ?: context.event.user
        val userBalance = context.instance.mongoClient.userUtils.getDiscordUser(user.id).userCakes.balance
        val formattedBalance = context.utils.formatNumber(userBalance, "pt", "BR")

        context.reply {
            content = context.prettyResponse {
                emoteId = FoxyEmotes.FOXY_DAILY
                content = context.locale["cakes.atm.balance", user.asMention, formattedBalance]
            }
        }
    }
}