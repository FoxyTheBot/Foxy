package modules

import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.HTMLElement
import org.w3c.dom.events.Event

fun showActionsWrapper() {
    val actionsWrapper = document.querySelector(".actions-wrapper") as? HTMLElement
    if (actionsWrapper != null && !actionsWrapper.classList.contains("show")) {
        actionsWrapper.classList.add("show")
    }
}

fun setUpActionsWrapper() {
    val form = document.querySelector(".config-module-form") as? HTMLElement
    val handler: (Event) -> Unit = { showActionsWrapper() }

    form?.addEventListener("input", handler)
    form?.addEventListener("change", handler)

    window.asDynamic().showActionsWrapper = ::showActionsWrapper
}
