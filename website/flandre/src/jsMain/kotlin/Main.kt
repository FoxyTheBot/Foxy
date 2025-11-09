import home.SoundUtils
import kotlinx.browser.document
import kotlinx.browser.window

fun main() {
    loadSavedTheme()

    window.onload = {
        setupPopupHandler()

        SoundUtils.playFumoSounds()
        document.getElementById("theme-toggle-btn")?.addEventListener("click", {
            toggleTheme()
        })
    }
}