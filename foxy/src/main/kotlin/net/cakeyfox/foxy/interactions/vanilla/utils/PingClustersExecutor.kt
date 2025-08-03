package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.ClusterUtils
import net.cakeyfox.serializable.data.cluster.ClusterInfo
import kotlin.math.round

class PingClustersExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val clusters = context.foxy.config.discord.clusters
        val infos = mutableListOf<Pair<Int, ClusterInfo?>>()

        for (cluster in clusters) {
            val info = ClusterUtils.getClusterInfo(context.foxy, cluster)
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

