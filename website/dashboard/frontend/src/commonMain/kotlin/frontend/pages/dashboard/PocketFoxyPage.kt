package frontend.pages.dashboard

import kotlinx.html.a
import kotlinx.html.body
import kotlinx.html.br
import kotlinx.html.button
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.h3
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.img
import kotlinx.html.main
import kotlinx.html.stream.createHTML
import frontend.utils.renderDashboardSidebar
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.getLanguage
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.UserSession

fun buildPocketFoxyPage(lang: String, user: UserSession?, isProduction: Boolean): String {
    val locale = getLanguage(lang)

    return createHTML().html {
        head {
            buildHead(
                titleText = "Foxy de Bolso",
                description = "Use meus comandos em qualquer lugar pelo Discord",
                url = "https://foxybot.xyz/br/pocket-foxy",
                isDashboard = true
            )
        }

        body {
            buildAd(true, isProduction)
            headerWithUser(user, locale)
            renderDashboardSidebar(locale)

            main {
                div("pocket-foxy-wrapper") {
                    h1("title") { +"Use a Foxy em qualquer lugar" }
                    br { }
                    h3("description") {
                        +"Use a Foxy em qualquer lugar! Sabia que você pode usar os slash commands da Foxy em qualquer lugar do Discord? Como no privado, grupos privados ou até em servidores em que a Foxy ainda não está!"
                        br {}
                        br {}
                        +"A maioria dos comandos a Foxy estão disponíveis no privado para você não precisar necessariamente de um servidor para usar os recursos dela!"
                        br {}
                        br {}
                        +"E se você cansar e não quiser mais usar, você pode remover ela da sua conta do Discord na aba \"Aplicativos autorizados\""
                    }

                    div("discord-buttons") {
                        a("https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=applications.commands&integration_type=1") {
                            button(classes = "pocket-foxy-btn") { +"Adicionar Foxy" }
                        }
                    }
                }
            }
        }
    }
}