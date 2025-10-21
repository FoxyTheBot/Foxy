package net.cakeyfox.foxy.utils.discord

import kotlinx.datetime.Clock
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.PremiumUtils.isUserPremium
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.entities.Member
import kotlin.time.Duration.Companion.days

object NitroUtils {
    private val PREMIUM_DURATION = 30.days
    private const val PREMIUM_TYPE = "Foxy Premium I"
    private val logger = KotlinLogging.logger { }

    suspend fun onBoostActivation(foxy: FoxyInstance, member: Member) {
        val userInfo = foxy.database.user.getFoxyProfile(member.user.id)
        if (isUserPremium(userInfo)) return

        foxy.database.user.updateUser(member.user.id) {
            userPremium.premium = true
            userPremium.premiumDate = Clock.System.now().plus(PREMIUM_DURATION)
            userPremium.premiumType = PREMIUM_TYPE
        }
        logger.info { "${member.id} boosted server ${member.guild.id}" }
        foxy.utils.sendDirectMessage(member.user) {
            embed {
                title = pretty(FoxyEmotes.FoxyYay, "Obrigada por impulsionar o servidor!")
                description = """
                    Olá! Obrigada por impulsionar o servidor **${member.guild.name}**! Por ser um servidor parceiro, você ganhou 1 mês de premium! Aproveite!
                """.trimIndent()
                color = Colors.FOXY_DEFAULT
                thumbnail = Constants.FOXY_WOW
            }

            actionRow(
                linkButton(
                    label = "Acessar painel de controle",
                    url = Constants.DASHBOARD_URL
                )
            )
        }
    }
}