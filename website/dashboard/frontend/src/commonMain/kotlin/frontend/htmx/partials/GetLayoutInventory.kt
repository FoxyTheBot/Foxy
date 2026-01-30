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
import net.cakeyfox.foxy.database.data.profile.Layout

@OptIn(ExperimentalKtorApi::class)
fun getLayoutInventoryPage(
    currentLayoutId: String,
    layouts: List<Layout?> = emptyList(),
    locale: FoxyLocale
): String {
    return createHTML().div("itens") {
        this.id = "inventory"

        layouts.forEach { layout ->
            if (layout != null) {
                div("item") {
                    if (layout.id == currentLayoutId) {
                        this.classes = setOf("item", "selected")
                    }

                    attributes.hx {
                        post = "/api/v1/user/layout/change/${layout.id}"
                        target = "this"
                        swap = HxSwap.none
                        trigger = "click"
                    }

                    div("item__icon") {
                        img {
                            this.classes = setOf("layout")
                            this.src = "https://stuff.foxybot.xyz/layouts/${layout.filename}?size=512"
                        }
                    }

                    div("item_info") {
                        h1("item-name") { +layout.name }
                    }
                }
            }
        }
    }
}