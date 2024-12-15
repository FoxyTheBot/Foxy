package net.cakeyfox.foxy.command.vanilla.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.cakeyfox.foxy.command.UnleashedCommandContext

class PingExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        context.reply {
            content = context.makeReply(
                FoxyEmotes.FOXY_OK,
                "Pong!\n" +
                        "Gateway ping: ${context.event.jda.gatewayPing}ms\n"
            )
        }
    }
}