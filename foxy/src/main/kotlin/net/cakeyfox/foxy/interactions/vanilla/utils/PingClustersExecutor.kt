package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.ClusterUtils.getClusterInfo
import net.cakeyfox.serializable.data.cluster.ClusterInfo
import kotlin.math.round

class PingClustersExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val clusters = context.foxy.config.discord.clusters
        val infos = mutableListOf<Pair<Int, ClusterInfo?>>()

        for (cluster in clusters) {
            val info = context.foxy.getClusterInfo(context.foxy, cluster)
            infos += cluster.id to info
        }

        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyDrinkingCoffee, "Cluster Info")
                for ((id, info) in infos) {
                    val name = info?.name ?: context.foxy.config.discord.clusters.find { it.id == id }?.name
                    val title = "Cluster $id (`$name`)"

                    if (info == null) {
                        field(pretty(FoxyEmotes.Offline, title), inline = true) {
                            this.value = "${FoxyEmotes.FoxyCry} Cluster offline"
                        }

                        continue
                    }

                    field(pretty(FoxyEmotes.Online, title), inline = true) {
                        this.value = buildString {
                            appendLine("**Shard ${info.minShard}/${info.maxShard}**")
                            appendLine("**Ping:** `${round(info.ping).toInt()}ms`")
                            appendLine("**Guilds:** ${info.guildCount}")
                        }
                    }
                }
                color = Colors.FOXY_DEFAULT
            }
        }
    }
}

