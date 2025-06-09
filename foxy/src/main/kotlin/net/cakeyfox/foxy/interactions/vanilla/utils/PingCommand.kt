package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class PingCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("ping", CommandCategory.UTILS) {
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)

        executor = PingExecutor()
    }

    inner class PingExecutor : FoxySlashCommandExecutor() {
        override suspend fun execute(context: FoxyInteractionContext) {
            val gatewayPing = context.jda.gatewayPing
            val currentShardId = context.jda.shardInfo.shardId
            val totalShards = context.jda.shardInfo.shardTotal
            val minClusterShards = context.foxy.currentCluster.minShard
            val maxClusterShards = context.foxy.currentCluster.maxShard + 1
            val currentClusterId = context.foxy.currentCluster.id
            val currentClusterName = context.foxy.currentCluster.name

            context.reply {
                embed {
                    title = pretty(FoxyEmotes.FoxyWow, "Pong! (Shard: #$currentShardId)")
                    thumbnail = context.jda.selfUser.effectiveAvatarUrl
                    color = Colors.FOXY_DEFAULT

                    field {
                        name = pretty(FoxyEmotes.FoxyCake, "Gateway Ping:")
                        value = "`${gatewayPing}ms`"
                        inline = false
                    }

                    field {
                        name = pretty(FoxyEmotes.FoxyHm, "Shard")
                        value = "`${currentShardId}/${totalShards}`"
                        inline = false
                    }

                    field {
                        name = pretty(FoxyEmotes.FoxyDrinkingCoffee, "Cluster:")
                        value =
                            "**Cluster $currentClusterId** - `${currentClusterName}` **($minClusterShards/$maxClusterShards)**"
                        inline = false
                    }
                }
            }
        }
    }
}