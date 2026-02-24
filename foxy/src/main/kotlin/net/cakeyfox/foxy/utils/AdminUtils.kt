package net.cakeyfox.foxy.utils

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.delay
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.foxy.database.data.guild.TempBan
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.PlaceholderUtils.getModerationPlaceholders
import net.cakeyfox.foxy.utils.discord.DiscordMessageUtils.getMessageFromJson
import net.cakeyfox.serializable.data.utils.DiscordEmbedBody
import net.cakeyfox.serializable.data.utils.DiscordFieldBody
import net.cakeyfox.serializable.data.utils.DiscordFooterBody
import net.cakeyfox.serializable.data.utils.DiscordImageBody
import net.cakeyfox.serializable.data.utils.DiscordMessageBody
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.entities.UserSnowflake
import net.dv8tion.jda.api.exceptions.ErrorResponseException
import net.dv8tion.jda.api.exceptions.RateLimitedException
import net.dv8tion.jda.api.requests.ErrorResponse

object AdminUtils {
    private val logger = KotlinLogging.logger {}

    suspend fun removeExpiredBans(
        foxy: FoxyInstance,
        guildId: String,
        expiredBans: List<TempBan>
    ) {
        val guild = foxy.shardManager.getGuildById(guildId) ?: return
        val guildData = foxy.database.guild.getGuild(guildId)

        expiredBans.forEach { expiredBan ->
            try {
                val user = foxy.shardManager.retrieveUserById(expiredBan.userId).await()
                val bannedBy = foxy.shardManager.retrieveUserById(expiredBan.bannedBy).await()

                foxy.database.guild.removeTempBanFromGuild(guildId, user.id)
                guild.unban(user)
                    .reason("Banimento expirado")
                    .await()

                try {
                    sendUnbanDm(foxy, guild, user, bannedBy, expiredBan)

                    val placeholders = getModerationPlaceholders(
                        foxy,
                        bannedBy,
                        user,
                        guild,
                        expiredBan.duration!!,
                        expiredBan.reason,
                        foxy.locale["UNBAN"]
                    )

                    delay(1000)
                    sendMessage(foxy, guildData, placeholders, guild)
                } catch (e: Exception) {
                    logger.warn { "Can't send message to ${expiredBan.userId}! Is DM closed? ${e.message}" }
                }

            } catch (e: RateLimitedException) {
                logger.warn { "Rate limited while unbanning ${expiredBan.userId}. Retrying in ${e.retryAfter}ms" }
                delay(e.retryAfter)
            } catch (e: Exception) {
                if (e.message?.startsWith("10026") == true) {
                    logger.warn { "Ban not found for ${expiredBan.userId}" }
                    foxy.database.guild.removeTempBanFromGuild(guildId, expiredBan.userId)
                } else {
                    logger.error(e) { "Error while unbanning ${expiredBan.userId}" }
                }
            }

            delay(50L)
        }
    }

    suspend fun banUsers(
        foxy: FoxyInstance,
        guildId: String,
        userAsSnowflakes: List<UserSnowflake>,
        reason: String,
        staff: User = foxy.shardManager.shards.first().selfUser,
        durationInMs: Long
    ) {
        val guild = foxy.shardManager.getGuildById(guildId) ?: return
        val guildData = foxy.database.guild.getGuild(guildId)

        try {
            guild.ban(userAsSnowflakes, null)
                .reason(reason + " - ${staff.name} (${staff.id})")
                .await()

            val durationInstant =
                if (durationInMs > 0) Instant.fromEpochMilliseconds(
                    Clock.System.now().toEpochMilliseconds() + durationInMs
                )
                else null

            userAsSnowflakes.forEach { userSnowflake ->
                val member = foxy.shardManager.retrieveUserById(userSnowflake.id).await()

                if (durationInstant != null) {
                    foxy.database.guild.addTempBanToGuild(
                        guildId,
                        TempBan(
                            userId = member.id,
                            reason = reason,
                            bannedBy = staff.id,
                            duration = durationInstant
                        )
                    )
                }

                val placeholders = getModerationPlaceholders(
                    foxy,
                    staff,
                    member,
                    guild,
                    durationInstant,
                    reason,
                    foxy.locale["BAN"]
                )

                sendDmMessage(foxy, guildData, placeholders, member, guild)
                sendMessage(foxy, guildData, placeholders, guild)
            }

        } catch (e: ErrorResponseException) {
            when (e.errorResponse) {
                ErrorResponse.FAILED_TO_BAN_USERS,
                ErrorResponse.UNKNOWN_BAN -> {
                    // Already banned users can catch at this
                }

                else -> {
                    logger.error(e) {
                        "Mass ban failed | guild=${guild.id} | users=${userAsSnowflakes.size} | staff=${staff.id}"
                    }
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "Failed to ban users on guild $guildId" }
        }
    }

    private suspend fun sendUnbanDm(
        foxy: FoxyInstance,
        guild: net.dv8tion.jda.api.entities.Guild,
        user: User,
        bannedBy: User,
        expiredBan: TempBan
    ) {
        foxy.utils.sendDirectMessage(user) {
            embed {
                color = Colors.FOXY_DEFAULT
                thumbnail = guild.iconUrl
                description = "Sua punição foi removida do servidor **${guild.name}**"

                field {
                    name = pretty(FoxyEmotes.FoxyBan, "Punido por")
                    value = "`@${bannedBy.name}` (`${bannedBy.id}`)"
                }

                field {
                    name = pretty(FoxyEmotes.FoxyDrinkingCoffee, "Motivo do Banimento")
                    value = expiredBan.reason
                }

                field {
                    name = pretty(FoxyEmotes.FoxyHm, "Expirou em")
                    value = foxy.utils.convertISOToExtendedDiscordTimestamp(expiredBan.duration!!)
                    inline = false
                }
            }
        }
    }

    fun buildBanUserMessageJson(): String {
        val body = DiscordMessageBody(
            content = "{@member}",
            embeds = listOf(
                DiscordEmbedBody(
                    color = Colors.FOXY_DEFAULT,
                    title = pretty(FoxyEmotes.FoxyBan, "{member.name} **|** {punishment.type}"),
                    fields = listOf(
                        DiscordFieldBody(
                            "Usuário",
                            "{member.name} (`{member.id}`)",
                        ),
                        DiscordFieldBody(
                            "Staff",
                            "{staff.name} (`{staff.id}`)",
                        ),
                        DiscordFieldBody(
                            "Motivo",
                            "{reason}"
                        ),
                        DiscordFieldBody("Duração", "{duration}"),
                    ),
                    thumbnail = DiscordImageBody("{member.avatar}"),
                    footer = DiscordFooterBody(
                        "{guild.name}",
                        "{guild.icon}"
                    )
                )
            )
        )

        return Json.encodeToString(body)
    }

    suspend fun sendMessage(
        foxy: FoxyInstance,
        guildData: Guild,
        placeholders: Map<String, String?>,
        guild: net.dv8tion.jda.api.entities.Guild
    ) {
        if (guildData.moderationUtils?.sendPunishmentsToAChannel != true) return

        val customMessage = guildData.moderationUtils?.customPunishmentMessage ?: buildBanUserMessageJson()
        val channelToSend = guildData.moderationUtils?.channelToSendPunishments ?: return
        val (content, embeds) = getMessageFromJson(customMessage, placeholders)

        foxy.utils.sendMessageToAGuildFromThisCluster(guild, channelToSend) {
            this.content = content
            if (embeds.isNotEmpty()) {
                this.embeds.plusAssign(embeds.first())
            }
        }
    }

    suspend fun sendDmMessage(
        foxy: FoxyInstance,
        guildData: Guild,
        placeholders: Map<String, String?>,
        punishedMember: User,
        guild: net.dv8tion.jda.api.entities.Guild
    ) {
        if (guildData.moderationUtils?.sendPunishmentsToDm != true) return

        val customDmMessage = guildData.moderationUtils?.customPunishmentDmMessage ?: run {
            val defaultMessage = buildBanUserMessageJson()
            val (content, embeds) = getMessageFromJson(defaultMessage, placeholders)

            foxy.utils.sendDirectMessage(punishedMember) {
                this.content = content

                if (embeds.isNotEmpty()) {
                    this.embeds.plusAssign(embeds.first())
                }
            }
            return
        }

        val (content, embeds) = getMessageFromJson(customDmMessage, placeholders)

        foxy.utils.sendDirectMessage(punishedMember) {
            this.content = """
            > ${
                pretty(
                    FoxyEmotes.FoxyCake,
                    "**Mensagem enviada pelo servidor: ${guild.name} `(${guild.id})`**"
                )
            }
            
                $content
            """.trimIndent()


            if (embeds.isNotEmpty()) {
                this.embeds.plusAssign(embeds.first())
            }
        }
    }
}