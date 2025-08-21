package net.cakeyfox.common

import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.hocon.Hocon

object Constants {
    const val UNBAN_FORM_URL = "https://forms.gle/bKfRKxoyFGZzRB7x8"
    const val FOXY_WEBSITE = "https://foxybot.xyz"
    const val TERMS = "https://foxybot.xyz/br/support/terms"
    const val SUPPORT_SERVER = "https://foxybot.xyz/br/support"
    const val INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255"
    const val PREMIUM = "https://foxybot.xyz/br/premium"
    const val DAILY = "https://foxybot.xyz/br/daily"
    const val DAILY_EMOJI = "https://stuff.foxybot.xyz/images/foxy_daily.png"
    const val FOXY_WOW = "https://stuff.foxybot.xyz/images/foxy_wow.png"
    const val DASHBOARD_URL = "https://foxybot.xyz/br/dashboard"
    const val FOXY_CRY = "https://stuff.foxybot.xyz/images/foxy_cry.png"
    const val FOXY_BAN = "https://stuff.foxybot.xyz/images/foxyban.png"

    // Discord
    const val AUTHORIZATION_ENDPOINT = "https://discord.com/api/oauth2/authorize"
    const val TOKEN_ENDPOINT = "https://discord.com/api/oauth2/token"
    const val DEFAULT_ENDPOINT = "https://discord.com/api/users/@me"

    @OptIn(ExperimentalSerializationApi::class)
    val HOCON = Hocon { useArrayPolymorphism = true }
    const val SUPPORT_SERVER_ID = "768267522670723094"
    const val UPVOTE_URL = "https://top.gg/bot/1006520438865801296/vote"
    const val FOXY_TIMEZONE = "America/Sao_Paulo"

    fun getDefaultActivity(activity: String, environment: String, clusterName: String?): String {
        if (clusterName != null) {
            return when(environment) {
                "development" -> "https://youtu.be/0OIqlp2U9EQ | Cluster: $clusterName"
                "production" -> "$activity | Cluster: $clusterName"
                else -> "$activity | Cluster: $clusterName"
            }
        } else {
            return when(environment) {
                "development" -> "https://youtu.be/0OIqlp2U9EQ"
                "production" -> activity
                else -> activity
            }
        }
    }

    /* ---- [Profile Assets] ---- */

    fun getProfileBackground(backgroundId: String): String {
        return "https://stuff.foxybot.xyz/backgrounds/$backgroundId"
    }

    fun getProfileLayout(layoutId: String): String {
        return "https://stuff.foxybot.xyz/layouts/$layoutId"
    }

    fun getProfileDecoration(maskId: String): String {
        return "https://stuff.foxybot.xyz/decorations/$maskId.png"
    }

    fun getMarriedOverlay(layoutId: String): String {
        return "https://stuff.foxybot.xyz/layouts/${layoutId}-married.png"
    }

    fun getProfileBadge(badgeId: String): String {
        return "https://stuff.foxybot.xyz/badges/$badgeId"
    }
}
