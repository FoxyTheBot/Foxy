package net.cakeyfox.serializable.database.data

import kotlinx.serialization.Serializable

@Serializable
data class FoxyverseGuild(
    val _id: String,
   val serverBenefits: ServerBenefits
) {
    @Serializable
    data class ServerBenefits(
        val givePremiumIfBoosted: PremiumIfBoostedSettings,
        val guildAdmins: List<String>,
        val serverInvite: String
    ) {
        @Serializable
        data class PremiumIfBoostedSettings(
            val isEnabled: Boolean,
            val notifyUser: Boolean,
            val textChannelToRedeem: String
        )
    }
}
