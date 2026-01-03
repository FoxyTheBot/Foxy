package modules

import kotlinx.browser.document
import kotlinx.dom.addClass
import kotlinx.dom.removeClass
import org.w3c.dom.Audio
import org.w3c.dom.HTMLElement
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.asList

fun setUpGuildSearchBar() {
    val searchInput = document.getElementById("search-bar") as? HTMLInputElement ?: return
    val serverList = document.getElementById("server-list") ?: return
    val blurOverlay = document.querySelector(".blurred-overlay") as? HTMLElement ?: return
    val audio = Audio("/assets/sfx/searchbar.wav")

    searchInput.addEventListener("focus", {
        audio.play()
        blurOverlay.addClass("active")
    })

    searchInput.addEventListener("blur", {
        audio.play()
        blurOverlay.removeClass("active")
    })

    val servers = serverList.querySelectorAll(".server").asList().mapNotNull { it as? HTMLElement }

    searchInput.oninput = {
        val query = searchInput.value.lowercase()

        servers.forEach { server ->
            val name = (server.querySelector("h1") as? HTMLElement)?.innerText?.lowercase() ?: ""
            server.style.display = if (name.contains(query)) "" else "none"
        }
    }
}