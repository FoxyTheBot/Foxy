import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.dom.addClass
import kotlinx.dom.removeClass
import modules.setUpActionsWrapper
import modules.setUpGuildSearchBar
import modules.setUpGuildSelectMenu
import modules.showActionsWrapper
import org.w3c.dom.HTMLBodyElement
import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.HTMLDivElement
import org.w3c.dom.HTMLElement
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.HTMLLIElement
import org.w3c.dom.asList
import org.w3c.dom.events.Event

fun main() {
    document.addEventListener("htmx:load", {
        setUpActionsWrapper()
        setUpGuildSearchBar()
    })

    setUpGuildSelectMenu()
}