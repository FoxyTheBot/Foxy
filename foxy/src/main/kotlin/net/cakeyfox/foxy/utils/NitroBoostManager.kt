package net.cakeyfox.foxy.utils

import kotlinx.datetime.Clock
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.database.data.UserPremium
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import kotlin.time.Duration.Companion.days

class NitroBoostManager(val foxy: FoxyInstance) {
    companion object {
        private val logger = KotlinLogging.logger { }
    }

    suspend fun handleUser(event: MessageReceivedEvent) {
        if (event.member!!.isBoosting) {
            val guild = foxy.database.guild.getPartnerGuild(event.guild.id)
                ?: return

            if (guild.serverBenefits.givePremiumIfBoosted.isEnabled) {
                if (guild.serverBenefits.givePremiumIfBoosted.textChannelToRedeem !== event.message.channelId) {
                    try {
                        val userData = foxy.database.user.getFoxyProfile(event.author.id)
                        if (userData.userPremium.premium) return
                        val newPremium = UserPremium().copy(
                            premium = true,
                            premiumDate = Clock.System.now() + 30.days,
                            premiumType = PremiumType.TIER2.s
                        )

                        foxy.database.user.updateUser(
                            event.author.id,
                            mapOf("userPremium" to newPremium)
                        )

                        // TODO: Send DM to user
                        logger.info { "Giving premium to ${event.author.name}(${event.author.id}) on ${event.guild.name} (${event.guild.id})" }
                    } catch (e: Exception) {
                        logger.error { "Error while sending DM to ${event.author.id}, is DM closed? $e" }
                    }
                }
            }
        }
    }
}