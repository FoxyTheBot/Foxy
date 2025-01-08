package net.cakeyfox.foxy.command.vanilla.utils

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

        val response = pretty(FoxyEmotes.FoxyHowdy, "Ping\n") +
                pretty(FoxyEmotes.FoxyWow, "Gateway Ping: ${gatewayPing}ms\n") +
                pretty(FoxyEmotes.FoxyThink, "Shard ID: ${currentShardId}/${totalShards}\n") +
                pretty(FoxyEmotes.FoxyCupcake, "Cluster: `${InetAddress.getLocalHost().hostName}`")

        context.reply {
            content = response
        }
    }
}