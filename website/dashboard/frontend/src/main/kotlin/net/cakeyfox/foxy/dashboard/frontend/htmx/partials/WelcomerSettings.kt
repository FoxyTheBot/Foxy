package net.cakeyfox.foxy.dashboard.frontend.htmx.partials

import kotlinx.html.InputType
import kotlinx.html.div
import kotlinx.html.form
import kotlinx.html.html
import kotlinx.html.id
import kotlinx.html.input
import kotlinx.html.label
import kotlinx.html.span
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.database.data.guild.Guild

fun welcomerSettings(guild: Guild, locale: FoxyLocale): String {
    return createHTML().form("config-module-form") {
        div("config-module") {
            label("module-name") { +"Enviar mensagem quando alguém entrar no servidor" }
            label("switch") {
                input(type = InputType.checkBox) {
                    this.id = "toggleWelcomeModule"
                    name = "toggleWelcomeModule"
                }

                span("slider round")
            }
        }
    }
}