package net.cakeyfox.foxy.command.vanilla.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import java.net.InetAddress

class PingExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val gatewayPing = context.jda.gatewayPing
        val currentShardId = context.jda.shardInfo.shardId + 1
        val totalShards = context.jda.shardInfo.shardTotal
        val hostname = withContext(Dispatchers.IO) {
            InetAddress.getLocalHost().hostName
        }

        val response = pretty(FoxyEmotes.FoxyHowdy, "**Pong!**\n") +
                pretty(FoxyEmotes.FoxyWow, "**Gateway Ping:** `${gatewayPing}ms`\n") +
                pretty(FoxyEmotes.FoxyThink, "**Shard ID:** `${currentShardId}/${totalShards}`\n") +
                pretty(FoxyEmotes.FoxyCupcake, "**Cluster:** `$hostname`")

        context.reply {
            content = response
        }
    }
}