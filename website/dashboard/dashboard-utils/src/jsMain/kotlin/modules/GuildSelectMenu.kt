package modules

import kotlinx.browser.document
import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.HTMLDivElement
import org.w3c.dom.HTMLLIElement
import org.w3c.dom.asList

fun setUpGuildSelectMenu() {
    val guildList = document.querySelector(".guild-list") as? HTMLDivElement ?: return
    val button = document.getElementById("server-select-btn") as? HTMLButtonElement ?: return
    val items = guildList.querySelectorAll("li").asList()

    button.addEventListener("click", {
        guildList.classList.toggle("open")
    })

    items.forEach { element ->
        val li = element as HTMLLIElement
        li.addEventListener("click", {
            val name = li.querySelector("span")?.textContent ?: "Servidor"
            button.textContent = name
            guildList.classList.remove("open")
        })
    }

    document.addEventListener("click", { event ->
        if (!guildList.contains(event.target as? org.w3c.dom.Node)) {
            guildList.classList.remove("open")
        }
    })
}