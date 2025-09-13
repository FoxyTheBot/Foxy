package net.cakeyfox.foxy.internal.routes

import dev.minn.jda.ktx.coroutines.await
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.add
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.ClusterUtils.getShardIdFromGuildId

class GetGuildInfo {
    fun Route.getGuildInfo(foxy: FoxyInstance) {
        get("/api/v1/guilds/{guildId}") {
            val guildId = call.parameters["guildId"]?.toLongOrNull()
            if (guildId == null) {
                call.respond(HttpStatusCode.BadRequest, null)
                return@get
            }

            val guild = foxy.shardManager.getGuildById(guildId) ?: run {
                call.respond(HttpStatusCode.NotFound, null)
                return@get
            }
            val availableStaticEmojis = guild.emojis.filter { it.isAvailable && !it.isAnimated }
            val firstEmojis = availableStaticEmojis.take(30).map { "<:${it.name}:${it.id}>" }
            val guildOwner = guild.retrieveOwner().await()

            val guildInfoAsJson = buildJsonObject {
                put("id", guild.id)
                put("name", guild.name)
                put("icon", guild.icon?.url)
                put("owner", buildJsonObject {
                    put("id", guildOwner?.user?.id)
                    put("username", guildOwner?.user?.name)
                    put("discriminator", guildOwner?.user?.discriminator)
                    put("avatar", guildOwner?.user?.effectiveAvatarUrl)
                })
                put("textChannels", buildJsonArray { guild.textChannels.forEach { add(it.id) } })
                put("voiceChannels", buildJsonArray { guild.voiceChannels.forEach { add(it.id) } })
                put("roles", buildJsonArray { guild.roles.forEach { add(it.id) } })
                put("emojis", buildJsonArray { guild.emojis.forEach { add(it.id) } })
                put("memberCount", guild.memberCount)
                put("boostCount", guild.boostCount)
                put("splashUrl", guild.splashUrl)
                put("createdAt", guild.timeCreated.toEpochSecond())
                put("joinedAt", guild.selfMember.timeJoined.toEpochSecond())
                put("shardId", getShardIdFromGuildId(guild.idLong, foxy.config.discord.totalShards))
                put("firstEmojis", buildJsonArray {
                    firstEmojis.forEach { add(it) }
                })
                put("clusterInfo", buildJsonObject {
                    put("id", foxy.currentCluster.id)
                    put("name", foxy.currentCluster.name)
                    put("minShard", foxy.currentCluster.minShard)
                    put("maxShard", foxy.currentCluster.maxShard)
                    put("isMasterCluster", foxy.currentCluster.isMasterCluster)
                    put("clusterUrl", foxy.currentCluster.clusterUrl)
                })
            }

            call.respondText(
                text = guildInfoAsJson.toString(),
                contentType = ContentType.Application.Json
            )
        }
    }
}