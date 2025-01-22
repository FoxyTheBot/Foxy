package net.cakeyfox.common

import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.hocon.Hocon
import java.io.InputStream

object Constants {
    const val UNBAN_FORM_URL = "https://forms.gle/bKfRKxoyFGZzRB7x8"
    const val FOXY_WEBSITE = "https://foxybot.win"
    const val TERMS = "https://foxybot.win/br/support/terms"
    const val SUPPORT_SERVER = "https://foxybot.win/br/support"
    const val INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255"
    const val PREMIUM = "https://foxybot.win/br/premium"
    const val DAILY = "https://foxybot.win/br/daily"
    const val DAILY_EMOJI = "https://cdn.discordapp.com/emojis/915736630495686696.png?size=2048"

    @OptIn(ExperimentalSerializationApi::class)
    val HOCON = Hocon { useArrayPolymorphism = true }
    const val SUPPORT_SERVER_ID = "768267522670723094"


    fun getDefaultActivity(environment: String, clusterName: String?): String {
        if (clusterName != null) {
            return when(environment) {
                "development" -> "https://youtu.be/0OIqlp2U9EQ | Cluster: $clusterName"
                "production" -> "foxybot.win · /help | Cluster: $clusterName"
                else -> "foxybot.win · /help | Cluster: $clusterName"
            }
        } else {
            return when(environment) {
                "development" -> "https://youtu.be/0OIqlp2U9EQ"
                "production" -> "foxybot.win · /help"
                else -> "foxybot.win · /help"
            }
        }
    }

    /* ---- [Profile Assets] ---- */

    fun getProfileBackground(backgroundId: String): InputStream {
        return javaClass.getResourceAsStream("/profile/backgrounds/$backgroundId")!!
    }

    fun getProfileLayout(layoutId: String): InputStream {
        return javaClass.getResourceAsStream("/profile/layouts/$layoutId")!!
    }

    fun getProfileDecoration(maskId: String): InputStream {
        return javaClass.getResourceAsStream("/profile/decorations/$maskId.png")!!
    }

    fun getMarriedOverlay(layoutId: String): InputStream {
        return javaClass.getResourceAsStream("/profile/layouts/${layoutId}-married.png")!!
    }

    fun getProfileBadge(badgeId: String): InputStream {
        return javaClass.getResourceAsStream("/profile/badges/$badgeId")!!
    }

}
