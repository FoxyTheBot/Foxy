import home.playFumoSounds
import home.setupFloatingMenu
import kotlinx.browser.window
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
    }
}