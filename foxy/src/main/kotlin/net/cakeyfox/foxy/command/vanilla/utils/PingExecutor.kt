package net.cakeyfox.foxy.command.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty

class PingExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val gatewayPing = context.jda.gatewayPing
        val currentShardId = context.jda.shardInfo.shardId + 1
        val totalShards = context.jda.shardInfo.shardTotal
        val minClusterShards = context.foxy.currentCluster.minShard
        val maxClusterShards = context.foxy.currentCluster.maxShard
        val currentClusterId = context.foxy.currentCluster.id
        val currentClusterName = context.foxy.currentCluster.name

        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyWow, "Pong!")
                thumbnail = context.foxy.selfUser.effectiveAvatarUrl
                color = Colors.FOXY_DEFAULT

                field {
                    name = pretty(FoxyEmotes.FoxyCupcake, "Gateway Ping:")
                    value = "`${gatewayPing}ms`"
                    inline = false
                }

                field {
                    name = pretty(FoxyEmotes.FoxyThink, "Shard")
                    value = "`${currentShardId}/${totalShards}`"
                    inline = false
                }

                field {
                    name = pretty(FoxyEmotes.FoxyDrinkingCoffee, "Cluster:")
                    value =
                        "Cluster $currentClusterId - `${currentClusterName}` **[$minClusterShards-$maxClusterShards]**"
                    inline = false
                }
            }
        }
    }
}