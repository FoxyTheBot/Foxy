package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import java.lang.management.ManagementFactory

class StatusExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
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

        val userCache = context.jda.userCache.size()
        val guildCache = context.jda.guildCache.size()
        val threads = threadMXBean.threadCount
        val peakThreads = threadMXBean.peakThreadCount

        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyDrinkingCoffee, "**Foxy's Status**")
                thumbnail = context.jda.selfUser.effectiveAvatarUrl
                color = Colors.BLURPLE

                field("${FoxyEmotes.Computer} **|** Used memory:", "${usedMemory}MB")
                field("${FoxyEmotes.Computer} **|** Allocated memory:", "${totalMemory}MB")
                field("${FoxyEmotes.Computer} **|** Max memory:", "${maxMemory}MB")
                field("${FoxyEmotes.Thread} **|** Active threads:", "$threads Threads")
                field("${FoxyEmotes.Graph} **|** Peak threads:", "$peakThreads Threads")
                field("${FoxyEmotes.Online} **|** User cache:", "$userCache Users")
                field("${FoxyEmotes.Online} **|** Guild cache:", "$guildCache Guilds")
                field("${FoxyEmotes.FoxyYay} **|** Total Shards:", "${foxy.config.discord.totalShards} Shards")
                field("${FoxyEmotes.FoxyHug} **|** Total clusters:", "${foxy.config.discord.clusters.size} Clusters")
                field("${FoxyEmotes.FoxyDrinkingCoffee} **|** Current cluster:", currentClusterInfo)
            }
        }
    }
}