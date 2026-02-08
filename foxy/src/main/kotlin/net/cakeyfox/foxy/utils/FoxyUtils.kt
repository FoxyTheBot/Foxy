package net.cakeyfox.foxy.utils

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.MessageCreateBuilder
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import kotlinx.datetime.Instant
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.serializable.data.cluster.RelayMessage
import net.cakeyfox.serializable.data.utils.ActionResponse
import net.cakeyfox.serializable.data.utils.FoxyConfig
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.exceptions.InsufficientPermissionException
import net.dv8tion.jda.api.exceptions.RateLimitedException
import net.dv8tion.jda.api.interactions.DiscordLocale
import java.text.NumberFormat
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

class FoxyUtils(
    val foxy: FoxyInstance
) {
    companion object {
        private val logger = KotlinLogging.logger { }
    }

    val availableLanguages = hashMapOf(
        DiscordLocale.PORTUGUESE_BRAZILIAN to "pt-br",
        DiscordLocale.ENGLISH_US to "en-us",
        DiscordLocale.SPANISH_LATAM to "es"
    )

    fun convertISOToDiscordTimestamp(iso: Instant): String {
        val convertedDate = iso.epochSeconds.let { "<t:$it:f> (<t:$it:R>)" }
        return convertedDate
    }

    fun formatUserBalance(balance: Long, locale: FoxyLocale, isBold: Boolean = true): String {
        val formattedNumber = formatNumber(balance.toDouble(), "pt", "BR")
        val formattedBalance = if (balance.toInt() == 1) {
            locale["cakes.atm.singleCake"]
        } else {
            locale["cakes.atm.multipleCakes"]
        }

        return if (isBold) {
            "**$formattedNumber $formattedBalance**"
        } else "$formattedNumber $formattedBalance"
    }

    fun generateHmac(data: String): String {
        val hmacSecret = foxy.config.internalApi.hmacSecret
        val mac = Mac.getInstance("HmacSHA256")
        val keySpec = SecretKeySpec(hmacSecret.toByteArray(Charsets.UTF_8), "HmacSHA256")
        mac.init(keySpec)
        val hmacBytes = mac.doFinal(data.toByteArray(Charsets.UTF_8))
        return hmacBytes.joinToString("") { "%02x".format(it) }
    }

    data class UserMatchesResult(
        val validUsers: List<User>,
        val remainingString: String?
    )

    suspend fun handleCommandExecutionException(context: CommandContext, e: Exception, commandName: String) {
        when (e) {
            is InsufficientPermissionException -> {
                context.reply(true) {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale[
                            "commands.missingPermissionError",
                            context.locale[
                                    "permissions.${e.permission.name}"
                            ]
                        ]
                    )
                }
            }

            else -> {
                logger.error(e) { "An error occurred while executing command: $commandName" }
                context.reply(true) {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["commands.error", e.toString()]
                    )
                }
            }
        }
    }

    suspend fun checkValidUsersFromString(
        context: CommandContext,
        usersAsString: String
    ): UserMatchesResult? {
        val split = usersAsString.split(" ")
        var matchedCount = 0

        val validUsers = mutableListOf<User>()

        for (input in split) {
            if (input.isBlank()) continue

            val regex = """<@!?(\d+)>""".toRegex()
            val matchResult = regex.find(input)
            val userId = matchResult?.groupValues?.get(1) ?: input

            try {
                val user = context.jda.retrieveUserById(userId).await()
                validUsers.add(user)
                matchedCount++
            } catch (_: Exception) {
                break
            }
        }

        if (validUsers.isEmpty()) {
            return null
        }

        return UserMatchesResult(validUsers, split.drop(matchedCount).joinToString(" "))
    }

    fun verifyHmac(data: String, signature: String): Boolean {
        logger.debug { "Verifying HMAC. Data: $data | Signature: $signature" }
        return generateHmac(data) == signature
    }

    fun convertLongToDiscordTimestamp(epoch: Long): String {
        val convertedDate = epoch.let { "<t:$it:f> (<t:$it:R>)" }
        return convertedDate
    }

    fun convertISOToSimpleDiscordTimestamp(iso: Instant): String {
        val convertedDate = iso.epochSeconds.let { "<t:$it:R>" }
        return convertedDate
    }

    fun convertISOToExtendedDiscordTimestamp(iso: Instant): String {
        val convertedDate = iso.epochSeconds.let { "<t:$it:f> (<t:$it:R>)" }
        return convertedDate
    }

    suspend fun sendMessageToAGuildFromThisCluster(
        guild: net.dv8tion.jda.api.entities.Guild,
        channelId: String,
        delayMs: Long = 1500L,
        block: InlineMessage<*>.() -> Unit
    ) {
        try {
            val message = MessageCreateBuilder().apply(block)
            delay(delayMs)

            foxy.shardManager.getGuildById(guild.id)?.getTextChannelById(channelId)
                ?.sendMessage(message.build())
                ?.await()
        } catch (e: Exception) {
            logger.error(e) { "Can't send message to this guild, is from this cluster?" }
        }
    }

    suspend fun sendMessageToAGuildChannel(
        guild: Guild,
        channelId: String,
        delayMs: Long = 1_500L,
        block: InlineMessage<*>.() -> Unit
    ) {
        val message = MessageCreateBuilder().apply(block)
        val guildShard = ClusterUtils.getShardIdFromGuildId(guild._id.toLong(), foxy.config.discord.totalShards)
        val guildCluster = ClusterUtils.getClusterByShardId(foxy, guildShard)

        if (guildCluster.id == foxy.currentCluster.id) {
            delay(delayMs)
            try {
                foxy.shardManager.getGuildById(guild._id)?.getTextChannelById(channelId)
                    ?.sendMessage(message.build())
                    ?.await()
            } catch (e: RateLimitedException) {
                val retryAfter = e.retryAfter
                logger.warn { "Rate limited. Retrying after ${retryAfter}ms" }
                delay(retryAfter)
                sendMessageToAGuildChannel(guild, channelId) { block() }
            }
        } else {
            val guildClusterUrl = guildCluster.clusterUrl.removeSuffix("/")
            logger.info { "Relaying message to Cluster ${guildCluster.id} (${guildCluster.name})" }

            val messageData = message.build()
            val payload = RelayMessage(
                content = messageData.content,
                embeds = messageData.embeds.map { it.toRelayEmbed() }
            )

            val request = foxy.http.post {
                url("$guildClusterUrl/api/v1/guilds/${guild._id}/$channelId")
                header("Content-Type", "application/json")
                header("Authorization", "Bearer ${foxy.config.internalApi.key}")
                setBody(payload)
            }

            logger.info { "Received Status: ${request.status.value} from Cluster ${guildCluster.id} (${guildCluster.name})" }
        }
    }

    suspend fun sendDirectMessage(user: User, delayMs: Long = 1500L, block: InlineMessage<*>.() -> Unit) {
        if (user.isBot || user.isSystem) return
        val message = MessageCreateBuilder {
            apply(block)
        }

        try {
            val channel = user.openPrivateChannel().await()
            if (channel.canTalk()) {
                channel.sendMessage(message.build()).await()
                delay(delayMs)
            } else logger.warn { "Can't send message to ${user.id}! Skipping..." }
        } catch (e: RateLimitedException) {
            val retryAfter = e.retryAfter
            logger.warn { "Rate limited. Retrying after $retryAfter ms for user ${user.id}" }
            delay(retryAfter)
            sendDirectMessage(user, delayMs) { block() }
        } catch (e: Exception) {
            logger.error { "Error while sending DM to user ${user.id}, is DM closed? ${e.message}" }
        }
    }

    fun convertToHumanReadableDate(iso: Instant): String {
        iso.let {
            val instant = java.time.Instant.ofEpochMilli(it.toEpochMilliseconds())
            val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                .withZone(ZoneId.systemDefault())

            return formatter.format(instant)
        }
    }

    private fun formatNumber(number: Double, language: String? = "pt", country: String? = "BR"): String {
        return NumberFormat.getNumberInstance(Locale(language, country))
            .format(number)
    }

    fun formatLongNumber(number: Long, language: String? = "pt", country: String? = "BR"): String {
        return NumberFormat.getNumberInstance(Locale(language, country))
            .format(number)
    }

    suspend fun getActionImage(action: String): String {
        return withContext(foxy.coroutineDispatcher) {
            val response: ActionResponse = try {
                foxy.http.get("https://nekos.life/api/v2/img/$action").body()
            } catch (_: Exception) {
                foxy.http.get("https://cakey.foxybot.xyz/roleplay/$action").body()
            }

            return@withContext response.url
        }
    }

    suspend fun handleBan(event: GenericEvent, context: CommandContext) {
        if (event !is SlashCommandInteractionEvent && event !is MessageReceivedEvent) return
        val discordUser = when (event) {
            is SlashCommandInteractionEvent -> event.user
            is MessageReceivedEvent -> event.author
            else -> null
        }
        val user = context.database.user.getFoxyProfile(discordUser!!.id)
        val isGuildOwner = context.guild?.ownerId == user._id

        context.reply {
            embed {
                title = pretty(
                    FoxyEmotes.FoxyRage,
                    context.locale["ban.title"]
                )
                color = Colors.RED
                thumbnail = Constants.FOXY_BAN

                description = context.locale["ban.description"]
                field {
                    name = context.locale["ban.field.reason"]
                    value = user.banReason.toString()
                    inline = false
                }

                field {
                    name = context.locale["ban.field.date"]
                    value = user.banDate?.let { convertISOToDiscordTimestamp(it) }.toString()
                    inline = false
                }
            }

            actionRow(
                linkButton(
                    FoxyEmotes.FoxyCake,
                    context.locale["ban.appealButton"],
                    Constants.UNBAN_FORM_URL
                )
            )
        }
        delay(1_000)
        if (isGuildOwner) {
            logger.info { "Leaving from banned guild: ${context.guild?.id} | Owner ID: ${discordUser.id}" }
            context.guild?.leave()?.await()
        }
    }
}