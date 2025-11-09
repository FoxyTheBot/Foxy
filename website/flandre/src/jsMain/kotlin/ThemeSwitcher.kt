import kotlinx.browser.document
import kotlinx.browser.localStorage
import kotlinx.browser.window
import org.w3c.dom.HTMLElement

private const val THEME_KEY = "reimu-theme"

fun enableDarkTheme() {
    val root = document.querySelector(":root") as? HTMLElement ?: return
    val themeSwitcherButton = document.getElementById("theme-toggle-btn") as HTMLElement

    val darkTheme = mapOf(
        "--reimu-primary-color" to "#e7385d",
        "--reimu-secondary-color" to "#353535",
        "--reimu-tertiary-color" to "#5a1e33",
        "--reimu-background-color" to "#121212",
        "--reimu-loading-overlay-color" to "rgba(29, 29, 29, 0.8)",
        "--reimu-feature-session-background" to "#1e1f22",
        "--reimu-feature-card-font-color" to "#eee",
        "--reimu-sidebar-color" to "#1e1e1e",
        "--reimu-sidebar-font-color" to "#ddd",
        "--reimu-sidebar-entry-hover" to "#e7385d",
        "--reimu-navbar-color" to "#1e1e1e3d",
        "--reimu-navbar-text-color" to "#fff",
        "--reimu-premium-card-background" to "var(--reimu-tertiary-color)",
        "--reimu-premium-card-font-color" to "#eee",
        "--reimu-default-font-color" to "#ddd",
        "--reimu-border-color" to "#e7385d",
        "--reimu-searchbar-text" to "#fff",
        "--reimu-searchbar-background" to "#1e1e1e",
    )

    darkTheme.forEach { (key, value) ->
        root.style.setProperty(key, value)
    }

    themeSwitcherButton.innerText = "☀️"
    localStorage.setItem(THEME_KEY, "dark")
}

fun disableDarkTheme() {
    val root = document.querySelector(":root") as? HTMLElement ?: return
    val themeSwitcherButton = document.getElementById("theme-toggle-btn") as HTMLElement

    val lightTheme = mapOf(
        "--reimu-primary-color" to "#e7385d",
        "--reimu-secondary-color" to "#fff",
        "--reimu-tertiary-color" to "#f8f7f6",
        "--reimu-border-color" to "#d1d1d1",
        "--reimu-background-color" to "#f8f7f6",
        "--reimu-loading-overlay-color" to "#f8f7f6",
        "--reimu-feature-session-background" to "#fff",
        "--reimu-feature-card-background" to "var(--reimu-tertiary-color)",
        "--reimu-feature-card-font-color" to "#2e3038",
        "--reimu-sidebar-entry-hover" to "#bbb",
        "--reimu-sidebar-color" to "#fff",
        "--reimu-sidebar-font-color" to "#353535",
        "--reimu-navbar-color" to "#ffffffa8",
        "--reimu-navbar-text-color" to "#2e3038",
        "--reimu-premium-card-background" to "var(--reimu-tertiary-color)",
        "--reimu-premium-card-font-color" to "#eee",
        "--reimu-default-font-color" to "#2e3038",
        "--reimu-border-color" to "#d1d1d1",
        "--reimu-searchbar-text" to "#000",
        "--reimu-searchbar-background" to "#fff",
        )

    lightTheme.forEach { (key, value) ->
        root.style.setProperty(key, value)
    }

    themeSwitcherButton.innerText = "🌙"
    localStorage.setItem(THEME_KEY, "light")
}

fun toggleTheme() {
    val current = localStorage.getItem(THEME_KEY)
    if (current == "dark") disableDarkTheme() else enableDarkTheme()
}

fun loadSavedTheme() {
    when (localStorage.getItem(THEME_KEY)) {
        "dark" -> enableDarkTheme()
        "light" -> disableDarkTheme()
        else -> {
            val prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            if (prefersDark) enableDarkTheme() else disableDarkTheme()
        }
    }
}