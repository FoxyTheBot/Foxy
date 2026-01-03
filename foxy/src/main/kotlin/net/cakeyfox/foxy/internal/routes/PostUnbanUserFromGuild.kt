package net.cakeyfox.foxy.internal.routes

import dev.minn.jda.ktx.coroutines.await
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import kotlinx.coroutines.delay
import kotlinx.datetime.Clock
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.AdminUtils.removeExpiredBans
import kotlin.collections.filter
import kotlin.collections.orEmpty

class PostUnbanUserFromGuild {
    fun Route.postUnbanUserFromGuild(foxy: FoxyInstance) {
        post("/api/v1/unban/{guildId}") {
            val guildId = call.parameters["guildId"] ?: return@post call.respondText("Missing guildId")

            val guild = foxy.shardManager.getGuildById(guildId) ?: return@post call.respondText("Unknown guild")
            val guildData = foxy.database.guild.getGuild(guild.id)
            val now = Clock.System.now()
            val expiredBans = guildData.tempBans.orEmpty().filter { it.duration != null && it.duration!! <= now }

            call.respond(
                HttpStatusCode.OK,
                "Cluster ${foxy.currentCluster.name}: Unban process started. This may take some time."
            )

            removeExpiredBans(foxy, guildId, expiredBans)
            delay(1_000L)
        }
    }
}