package net.cakeyfox.common

object Constants {
    const val UNBAN_FORM_URL = "https://forms.gle/bKfRKxoyFGZzRB7x8"
    const val FOXY_WEBSITE = "https://foxybot.win"
    const val CROWDIN = "https://foxybot.win/translate"
    const val TERMS = "https://foxybot.win/br/support/terms"
    const val SUPPORT_SERVER = "https://foxybot.win/br/support"
    const val INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255"
    const val PREMIUM = "https://foxybot.win/br/premium"
    const val DAILY = "https://foxybot.win/br/daily"
    const val DAILY_EMOJI = "https://cdn.discordapp.com/emojis/915736630495686696.png?size=2048"
    const val FOXY_AVATAR = "https://cdn.discordapp.com/attachments/1078322762550083736/1315459766658797578/FOXYY.png?ex=67577ce0&is=67562b60&hm=25bb221e356336dee5d5fac46fdca3cfd83695a89f14841a167b8dc1bcd76f9d&"

    fun robloxProfile(id: Long): String {
        return "https://www.roblox.com/users/$id/profile"
    }

    const val DEFAULT_ACTIVITY = "foxybot.win | f!help"
}
