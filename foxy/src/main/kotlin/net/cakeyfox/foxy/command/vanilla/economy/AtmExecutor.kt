package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import java.text.NumberFormat
import java.util.Locale

class AtmExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        val user = context.event.getOption("user")?.asUser ?: context.event.user
        val userBalance = context.instance.mongoClient.getDiscordUser(user.id).userCakes.balance
        val formattedBalance = NumberFormat.getNumberInstance(Locale("pt", "BR"))
            .format(userBalance)

        context.reply {
            content = context.makeReply(
                FoxyEmotes.FOXY_DAILY,
                context.locale["commands.command.cakes.atm.balance", user.asMention, formattedBalance]
            )
        }
    }
}