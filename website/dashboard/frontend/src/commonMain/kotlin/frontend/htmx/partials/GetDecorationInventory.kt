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
import net.cakeyfox.foxy.database.data.profile.Decoration

@OptIn(ExperimentalKtorApi::class)
fun getDecorationInventory(
    currentDecorationId: String?,
    userDecorations: List<Decoration?> = emptyList()
): String {
    return createHTML().div("itens decorations") {
        this.id = "inventory"

            div ("item decoration") {
                attributes.hx {
                    post = "/api/v1/user/decoration/change/none"
                    target = "this"
                    swap = HxSwap.none
                    trigger = "click"
                }

                div ("item__icon") {
                    img {
                        this.classes = setOf("decorations")
                        this.src = "/assets/images/none.png"
                    }
                }
            }


        userDecorations.forEach { decoration ->
            if (decoration != null) {
                div ("item decoration") {
                    if (decoration.id == currentDecorationId) {
                        this.classes = setOf("item", "decoration", "selected")
                    }

                    attributes.hx {
                        post = "/api/v1/user/decoration/change/${decoration.id}"
                        target = "this"
                        swap = HxSwap.none
                        trigger = "click"
                    }

                    div ("item__icon") {
                        img {
                            this.classes = setOf("decorations")
                            this.src = "https://stuff.foxybot.xyz/decorations/${decoration.id}.png"
                        }
                    }
                }
            }
        }
    }
}