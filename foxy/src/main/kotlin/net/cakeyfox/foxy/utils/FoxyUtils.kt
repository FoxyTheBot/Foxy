package net.cakeyfox.foxy.utils

import dev.minn.jda.ktx.coroutines.await
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import kotlinx.datetime.Instant
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.cakeyfox.serializable.data.ActionResponse
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.exceptions.RateLimitedException
import net.dv8tion.jda.api.interactions.DiscordLocale
import net.dv8tion.jda.api.utils.messages.MessageCreateData
import java.text.NumberFormat
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*

class FoxyUtils(
    val foxy: FoxyInstance
) {
    companion object {
        private val logger = KotlinLogging.logger {  }
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

    suspend fun sendDM(user: User, message: MessageCreateData, delayMs: Long = 1500L) {
        if (user.isBot || user.isSystem) return

        try {
            val channel = user.openPrivateChannel().await()
            if (channel.canTalk()) {
                channel.sendMessage(message).await()
                delay(delayMs)
            } else logger.warn { "Can't send message to ${user.id}! Skipping..." }
        } catch (e: RateLimitedException) {
            val retryAfter = e.retryAfter
            logger.warn { "Rate limited. Retrying after $retryAfter ms for user ${user.id}" }
            delay(retryAfter)
            sendDM(user, message, delayMs)
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
                foxy.httpClient.get("https://nekos.life/api/v2/img/$action").body()
            } catch (e: Exception) {
                foxy.httpClient.get("https://cakey.foxybot.xyz/roleplay/$action").body()
            }

            return@withContext response.url
        }
    }

    suspend fun handleBan(event: SlashCommandInteractionEvent, context: FoxyInteractionContext) {
        val user = context.database.user.getFoxyProfile(event.user.id)

        context.reply {
            embed {
                title = pretty(
                    FoxyEmotes.FoxyRage,
                    context.locale["ban.title"]
                )

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
    }
}