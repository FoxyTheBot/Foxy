package net.cakeyfox.common

object Constants {
    const val UNBAN_FORM_URL = "https://forms.gle/bKfRKxoyFGZzRB7x8"
    const val FOXY_WEBSITE = "https://foxybot.xyz"
    const val TERMS = "https://foxybot.xyz/br/support/terms"
    const val SUPPORT_SERVER = "https://foxybot.xyz/br/support"
    const val INVITE_LINK =
        "https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255"
    const val PREMIUM = "https://foxybot.xyz/br/premium"
    const val DAILY = "https://foxybot.xyz/br/daily"
    const val DAILY_EMOJI = "https://stuff.foxybot.xyz/images/foxy_daily.png"
    const val FOXY_WOW = "https://stuff.foxybot.xyz/images/foxy_wow.png"
    const val DASHBOARD_URL = "https://foxybot.xyz/br/dashboard"
    const val FOXY_CRY = "https://stuff.foxybot.xyz/images/foxy_cry.png"
    const val FOXY_BAN = "https://stuff.foxybot.xyz/images/foxyban.png"
    const val FOXY_FUMO = "https://stuff.foxybot.xyz/images/foxy_fumo.png"
    const val PUBSUBHUBBUB_SUBSCRIBE = "https://pubsubhubbub.appspot.com/subscribe"
    const val YOUTUBE_FEED = "https://www.youtube.com/xml/feeds/videos.xml"
    const val FOXY_BANNER = "https://stuff.foxybot.xyz/images/banner.png"
    const val DISCORD_DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png"
    const val FOXY_RADIO_URL = "https://stream.zeno.fm/n581qrfyvchvv"

    // Discord
    const val AUTHORIZATION_ENDPOINT = "https://discord.com/api/oauth2/authorize"
    const val TOKEN_ENDPOINT = "https://discord.com/api/oauth2/token"
    const val DEFAULT_ENDPOINT = "https://discord.com/api/users/@me"
    const val DISCORD_GUILD_LIST = "https://discord.com/api/users/@me/guilds"

    // Last.fm
    const val LASTFM_API = "https://ws.audioscrobbler.com/2.0/"

    const val SUPPORT_SERVER_ID = "768267522670723094"
    const val UPVOTE_URL = "https://top.gg/bot/1006520438865801296/vote"
    const val FOXY_TIMEZONE = "America/Sao_Paulo"

    // Showtime Endpoints
    const val ANTES_QUE_VIRE_MODA_ROUTE = "/memes/antesqueviremoda"
    const val EMINEM_ROUTE = "/memes/8mile"
    const val ERROR_ROUTE = "/memes/windowserror"
    const val GIRLFRIEND_ROUTE = "/memes/girlfriend"
    const val GOSTOS_IGUAIS_ROUTE = "/memes/gosto"
    const val LARANJO_ROUTE = "/memes/laranjo"
    const val NOT_STONKS_ROUTE = "/memes/notstonks"
    const val STONKS_ROUTE = "/memes/stonks"

    fun getDefaultActivity(
        activity: String,
        environment: String,
        clusterId: Int?,
        shards: Int
    ): String {
        return "💫 $activity"
    }

    // Website utils
    const val DISCORD_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png"

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
