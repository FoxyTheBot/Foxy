package frontend.htmx.partials

import io.ktor.htmx.HxSwap
import io.ktor.htmx.html.hx
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.html.classes
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.database.data.profile.Background

@OptIn(ExperimentalKtorApi::class)
fun getBackgroundInventory(
    currentBackgroundId: String,
    backgrounds: List<Background?> = emptyList(),
    locale: FoxyLocale
): String {
    return createHTML().div("itens") {
        this.id = "inventory"

        backgrounds.forEach { background ->
            if (background != null) {
                div("item") {
                    if (background.id == currentBackgroundId) {
                        this.classes = setOf("item", "selected")
                    }

                    attributes.hx {
                        post = "/api/v1/user/background/change/${background.id}"
                        target = "this"
                        swap = HxSwap.none
                        trigger = "click"
                    }

                    div("item__icon") {
                        img {
                            this.classes = setOf("background")
                            this.src = "https://stuff.foxybot.xyz/backgrounds/${background.filename}?size=512"
                        }
                    }

                    div("item_info") {
                        h1("item-name") { +background.name }
                    }
                }
            }
        }
    }
}