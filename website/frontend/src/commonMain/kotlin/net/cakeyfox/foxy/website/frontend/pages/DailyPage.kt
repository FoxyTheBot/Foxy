package net.cakeyfox.foxy.website.frontend.pages

import kotlinx.html.body
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.database.data.user.FoxyUser
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.getLanguage
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.UserSession

fun dailyPage(lang: String, user: UserSession?, isAuthenticated: Boolean): String {
    return createHTML().html {
        val locale = getLanguage(lang)

        head {
            buildHead(
                "Resgate seu prêmio diário",
                "Seus cakes diários estão te esperando! Está esperando o que? Venha pegar!",
                image = "emojis/foxy_daily.png"
            )
        }

        body {
            headerWithUser(user, locale)

            div("daily-page") {
                h1("daily-title") { +"Prêmio Diário" }
            }
        }
    }
}