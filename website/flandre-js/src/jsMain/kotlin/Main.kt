import home.playFumoSounds
import home.setupFloatingMenu
import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.HTMLDivElement
import org.w3c.dom.HTMLElement
import org.w3c.dom.asList
import popup.setupPopupHandler

fun main() {
    loadSavedTheme()

    window.onload = {
        setupFloatingMenu("support-header-btn", "support-menu")
        setupFloatingMenu("features-header-btn", "features-menu")
        setupFloatingMenu("login-header-btn", "dashboard-menu")
        setupPopupHandler()
        playFumoSounds()
        setupThemeSwitcher()

        val commandItems = document
            .querySelectorAll(".command-item")
            .asList()

        commandItems.forEach { element ->
            val item = element as HTMLElement

            item.addEventListener("click", {
                item.classList.toggle("open")
            })
        }
    }
}