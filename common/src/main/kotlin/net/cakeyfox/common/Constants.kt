package net.cakeyfox.common

import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.hocon.Hocon

object Constants {
    const val UNBAN_FORM_URL = "https://forms.gle/bKfRKxoyFGZzRB7x8"
    const val FOXY_WEBSITE = "https://foxybot.win"
//    const val CROWDIN = "https://foxybot.win/translate"
    const val TERMS = "https://foxybot.win/br/support/terms"
    const val SUPPORT_SERVER = "https://foxybot.win/br/support"
    const val INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255"
    const val PREMIUM = "https://foxybot.win/br/premium"
    const val DAILY = "https://foxybot.win/br/daily"
    const val DAILY_EMOJI = "https://cdn.discordapp.com/emojis/915736630495686696.png?size=2048"

    @OptIn(ExperimentalSerializationApi::class)
    val HOCON = Hocon { useArrayPolymorphism = true }
    const val SUPPORT_SERVER_ID = "768267522670723094"


    fun getDefaultActivity(environment: String): String {
        return when(environment) {
            "development" -> "https://youtu.be/0OIqlp2U9EQ"
            "production" -> "foxybot.win · /help"
            else -> "foxybot.win · /help"
        }
    }

    /* ---- [Profile Assets] ---- */
    fun getProfileBackground(backgroundId: String): String {
        return "https://cakey.foxybot.win/assets/backgrounds/$backgroundId"
    }

    fun getProfileLayout(layoutId: String): String {
        return "https://cakey.foxybot.win/assets/layouts/$layoutId"
    }

    fun getProfileDecoration(maskId: String): String {
        return "https://cakey.foxybot.win/assets/masks/$maskId.png"
    }

    fun getMarriedOverlay(layoutId: String): String {
        return "https://cakey.foxybot.win/assets/layouts/${layoutId}-married.png"
    }

    fun getProfileBadge(badgeId: String): String {
        return "https://cakey.foxybot.win/assets/badges/$badgeId"
    }
}
