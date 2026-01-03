package net.cakeyfox.foxy.website.frontend.utils

import kotlinx.html.FlowContent
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.id
import kotlinx.html.img

fun FlowContent.isLoading() {
    div("loading-overlay") {
        id = "loadingOverlay"

        img (src = "/assets/emojis/foxypat-6.gif")
        h1("title") { +"Carregando" }
    }
}