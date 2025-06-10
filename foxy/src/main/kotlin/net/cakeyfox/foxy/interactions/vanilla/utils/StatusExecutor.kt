package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import java.lang.management.ManagementFactory

class StatusExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val mb = 1024 * 1024
        val runtime = Runtime.getRuntime()
        val threadMXBean = ManagementFactory.getThreadMXBean()
        val foxy = context.foxy
        val currentCluster = foxy.currentCluster

        val totalMemory = runtime.totalMemory() / mb
        val freeMemory = runtime.freeMemory() / mb
        val usedMemory = totalMemory - freeMemory
        val maxMemory = runtime.maxMemory() / mb

        val currentClusterName = currentCluster.name
        val currentClusterId = currentCluster.id
        val currentClusterShards = "${currentCluster.minShard} / ${currentCluster.maxShard}"
        val currentClusterInfo = "`$currentClusterName` (${currentClusterId}) (Shards: $currentClusterShards)"

        val threads = threadMXBean.threadCount
        val peakThreads = threadMXBean.peakThreadCount

        val msg = buildString {
            appendLine(pretty(FoxyEmotes.FoxyDrinkingCoffee, "**Foxy's Status**"))
            appendLine(pretty(FoxyEmotes.Computer, "Used memory: ${usedMemory}MB"))
            appendLine(pretty(FoxyEmotes.Computer, "Allocated memory: ${totalMemory}MB"))
            appendLine(pretty(FoxyEmotes.Computer, "Max memory: ${maxMemory}MB"))
            appendLine(pretty(FoxyEmotes.Thread, "Active threads: $threads"))
            appendLine(pretty(FoxyEmotes.Graph, "Peak threads: $peakThreads"))
            appendLine(pretty(FoxyEmotes.FoxyYay, "Total Shards: ${foxy.config.discord.totalShards}"))
            appendLine(pretty(FoxyEmotes.FoxyDrinkingCoffee, "Current cluster: $currentClusterInfo"))
            appendLine(pretty(FoxyEmotes.FoxyHug, "Total clusters: ${foxy.config.discord.clusters.size}"))
        }

        context.reply {
            content = msg
        }
    }
}