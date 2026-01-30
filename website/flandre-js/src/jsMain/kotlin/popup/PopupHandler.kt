package popup

import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.HTMLImageElement
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.HTMLSelectElement

fun setupPopupHandler() {
    window.asDynamic().showPopup = ::showPopup
    window.asDynamic().hidePopup = ::hidePopup
}

fun showPopup(type: String) {
    val popup = document.getElementById("popup") ?: return
    popup.classList.add("visible")
    popup.classList.remove("hidden")
    setUpImportFromJson(type)
}

fun hidePopup() {
    val popup = document.getElementById("popup") ?: return
    popup.classList.remove("visible")

    val jsonInput = document.getElementById("jsonInput") as? HTMLInputElement
    val botSelector = document.getElementById("botSelect") as? HTMLSelectElement
    val botImage = document.getElementById("botImage") as? HTMLImageElement

    jsonInput?.value = ""
    botSelector?.value = ""
    botImage?.src = "https://cdn.discordapp.com/embed/avatars/0.png"

    window.setTimeout({
        popup.classList.add("hidden")
    }, 300)
}