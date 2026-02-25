package net.cakeyfox.foxy.tasks

import kotlinx.coroutines.delay
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.AdminUtils
import net.cakeyfox.foxy.utils.ClusterUtils.getClusterByShardId
import net.cakeyfox.foxy.utils.ClusterUtils.getShardIdFromGuildId
import net.cakeyfox.foxy.utils.ClusterUtils.removePunishmentFromAGuildFromAnotherCluster
import net.cakeyfox.foxy.utils.RunnableCoroutine
import net.cakeyfox.serializable.data.cluster.UnbanRouteRequest

class CheckExpiredBansTask(
    private val foxy: FoxyInstance
) : RunnableCoroutine {

    override suspend fun run() {
        val expiredBans = foxy.database.guild.getAllExpiredBans()

        expiredBans.forEach { (guildId, expiredBans) ->
            val guildShardId = getShardIdFromGuildId(guildId.toLong(), foxy.config.discord.totalShards)
            val guildCluster = getClusterByShardId(foxy, guildShardId)

            delay(500) // Time to breath
            if (guildCluster.id == foxy.currentCluster.id) {
                AdminUtils.removeExpiredBans(foxy, guildId, expiredBans)
            } else {
                removePunishmentFromAGuildFromAnotherCluster(foxy, guildCluster, guildId)
            }
        }
    }
}