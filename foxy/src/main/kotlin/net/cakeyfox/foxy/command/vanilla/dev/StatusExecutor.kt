package net.cakeyfox.foxy.command.vanilla.dev

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import java.lang.management.ManagementFactory
import com.sun.management.OperatingSystemMXBean as SunOperatingSystemMXBean

class StatusExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val mb = 1024 * 1024
        val runtime = Runtime.getRuntime()
        val osBean = ManagementFactory.getOperatingSystemMXBean()
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

        val processCpu = if (osBean is SunOperatingSystemMXBean)
            (osBean.processCpuLoad * 100).takeIf { it >= 0 }?.let { "%.2f".format(it) } ?: "N/A"
        else "N/A"

        val systemCpu = if (osBean is SunOperatingSystemMXBean)
            (osBean.systemCpuLoad * 100).takeIf { it >= 0 }?.let { "%.2f".format(it) } ?: "N/A"
        else "N/A"

        val msg = buildString {
            appendLine(pretty(FoxyEmotes.FoxyDrinkingCoffee, "**Foxy's Status**"))
            appendLine(pretty(FoxyEmotes.Computer, "Used memory: ${usedMemory}MB"))
            appendLine(pretty(FoxyEmotes.Computer, "Allocated memory: ${totalMemory}MB"))
            appendLine(pretty(FoxyEmotes.Computer, "Max memory: ${maxMemory}MB"))
            appendLine(pretty(FoxyEmotes.Computer, "JVM CPU: $processCpu%"))
            appendLine(pretty(FoxyEmotes.Computer, "System CPU: $systemCpu%"))
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