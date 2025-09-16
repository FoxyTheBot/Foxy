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
        val buildNumber = System.getenv("BUILD_NUMBER") ?: "0"
        val commitHash = System.getenv("COMMIT_HASH") ?: "unknown"
        val javaVersion = System.getProperty("java.version")
        val kotlinVersion = KotlinVersion.CURRENT.toString()

        val totalMemory = runtime.totalMemory() / mb
        val freeMemory = runtime.freeMemory() / mb
        val usedMemory = totalMemory - freeMemory
        val maxMemory = runtime.maxMemory() / mb

        val currentClusterName = currentCluster.name
        val currentClusterId = currentCluster.id
        val currentClusterShards = "${currentCluster.minShard} / ${currentCluster.maxShard}"
        val currentClusterInfo = "Foxy Cluster $currentClusterId (`$currentClusterName`) [Shards: $currentClusterShards]"
        val userCache = context.jda.userCache.size()
        val guildCache = context.jda.guildCache.size()
        val threads = threadMXBean.threadCount

        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyDrinkingCoffee, currentClusterInfo)
                thumbnail = context.jda.selfUser.effectiveAvatarUrl
                color = Colors.FOXY_DEFAULT

                field("${FoxyEmotes.Computer} Environment", context.foxy.environment.uppercase())
                field("${FoxyEmotes.Java} Java Version", javaVersion)
                field("${FoxyEmotes.Kotlin} Kotlin Version", kotlinVersion)
                field("${FoxyEmotes.GitHubLogo} Build Number", "#$buildNumber")
                field("${FoxyEmotes.FoxyYay} Total Shards:", "${foxy.config.discord.totalShards} Shards")
                field("${FoxyEmotes.FoxyHug} Total Clusters:", "${foxy.config.discord.clusters.size} Clusters")
                field("${FoxyEmotes.Computer} Used Memory:", "${usedMemory}MB")
                field("${FoxyEmotes.Computer} Allocated Memory:", "${totalMemory}MB")
                field("${FoxyEmotes.Computer} Max Memory:", "${maxMemory}MB")
                field("${FoxyEmotes.Thread} Active Threads:", "$threads Threads")
                field("${FoxyEmotes.Online} User Cache:", "$userCache Users")
                field("${FoxyEmotes.Online} Guild Cache:", "$guildCache Guilds")
                footer("Commit Hash: $commitHash")
            }
        }
    }
}