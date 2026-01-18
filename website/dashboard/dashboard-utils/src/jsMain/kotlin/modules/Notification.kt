package modules

import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.Audio
import org.w3c.dom.HTMLDivElement
import org.w3c.dom.HTMLImageElement

fun showToast(message: String, type: String? = "success") {
    val toastContainer = document.querySelector(".notifications-container") as? HTMLDivElement

    val toast = document.createElement("div") as HTMLDivElement
    toast.classList.add("notification", type!!)
    toast.innerText = message

    toastContainer?.appendChild(toast)

    window.setTimeout({
        val audio = Audio("/assets/sfx/notification.wav")
        audio.play()

        toast.classList.add("show")
    }, 10)

    window.setTimeout({
        toast.classList.remove("show")

        window.setTimeout({
            toast.remove()
        }, 510)
    }, 2500)
}