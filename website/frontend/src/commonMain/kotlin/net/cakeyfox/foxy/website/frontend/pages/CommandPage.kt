package net.cakeyfox.foxy.website.frontend.pages

import kotlinx.html.body
import kotlinx.html.h1
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.main
import kotlinx.html.stream.createHTML
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.getLanguage
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.UserSession

fun commandPage(lang: String, user: UserSession?, isProduction: Boolean): String {
    return createHTML().html {
        val locale = getLanguage(lang)

        head {
            buildHead(
                "Foxy | Comandos",
                "Veja minhas funcionalidades",
            )
        }

        body {
            headerWithUser(user, locale)

            main("commands-page") {
                h1("commands-title") { +"Comandos" }

                buildAd(false, isProduction)


            }
        }
    }
}