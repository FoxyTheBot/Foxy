package modules

import kotlinx.browser.document
import org.w3c.dom.Element
import org.w3c.dom.HTMLElement
import org.w3c.dom.asList

fun onInventoryItemChange() {
    document.body?.addEventListener("htmx:afterRequest",  {
        val target = it.target as? HTMLElement

        if (target != null && target.classList.contains("item")) {
            document.querySelectorAll(".item.selected").asList().forEach { it ->
                (it as Element).classList.remove("selected")
            }

            target.classList.add("selected")

            showToast("Suas alterações foram salvas!")
        }
    })
}