import kotlinx.browser.document
import kotlinx.browser.localStorage
import kotlinx.browser.window
import org.w3c.dom.HTMLElement
import org.w3c.dom.HTMLImageElement

private const val THEME_KEY = "foxy-theme"

fun setupThemeSwitcher() {
    document.getElementById("theme-toggle-btn")?.addEventListener("click", {
        toggleTheme()
    })
}

fun enableDarkTheme() {
    val root = document.querySelector(":root") as? HTMLElement ?: return
    val themeSwitcherButton = document.getElementById("theme-toggle-btn") as HTMLElement
    val foxyBody = document.getElementById("foxy-body") as? HTMLImageElement

    if (foxyBody != null) {
        foxyBody.src = "/assets/images/foxy-fullbody-darktheme.png"
    }

    val darkTheme = mapOf(
        "--reimu-primary-color" to "#e7385d",
        "--reimu-secondary-color" to "#25232d",
        "--reimu-tertiary-color" to "#1b1a21",
        "--reimu-background-color" to "#1b1a21",
        "--reimu-loading-overlay-color" to "#1b1a21",
        "--reimu-sidebar-separator" to "#ffffff06",
        "--reimu-feature-session-background" to "#25232d",
        "--reimu-feature-card-font-color" to "#eee",
        "--reimu-sidebar-color" to "#1e1f22",
        "--reimu-sidebar-font-color" to "#ddd",
        "--reimu-sidebar-entry-hover" to "#e7385d",
        "--reimu-navbar-color" to "#1e1e1e3d",
        "--reimu-navbar-text-color" to "#fff",
        "--reimu-premium-card-background" to "#3a161e",
        "--reimu-premium-card-font-color" to "#eee",
        "--reimu-default-font-color" to "#ddd",
        "--reimu-embed-color" to "#393a41",
        "--reimu-border-color" to "#e7385d",
        "--reimu-searchbar-text" to "#fff",
        "--reimu-searchbar-background" to "#1e1e1e",
        "--reimu-header-border" to "#00000000"
    )

    darkTheme.forEach { (key, value) ->
        root.style.setProperty(key, value)
    }

    themeSwitcherButton.innerHTML = Icons.SUN
    localStorage.setItem(THEME_KEY, "dark")
}

fun disableDarkTheme() {
    val root = document.querySelector(":root") as? HTMLElement ?: return
    val themeSwitcherButton = document.getElementById("theme-toggle-btn") as HTMLElement
    val foxyBody = document.getElementById("foxy-body") as? HTMLImageElement

    if (foxyBody != null) {
        foxyBody.src = "/assets/images/foxy-fullbody-whitetheme.png"
    }

    val lightTheme = mapOf(
        "--reimu-primary-color" to "#e7385d",
        "--reimu-secondary-color" to "#fff",
        "--reimu-tertiary-color" to "#f8f7f6",
        "--reimu-border-color" to "#d1d1d1",
        "--reimu-background-color" to "#f8f7f6",
        "--reimu-loading-overlay-color" to "#bbbbbb91",
        "--reimu-sidebar-separator" to "#c2c2c25c",
        "--reimu-feature-session-background" to "#fff",
        "--reimu-feature-card-background" to "var(--reimu-tertiary-color)",
        "--reimu-feature-card-font-color" to "#2e3038",
        "--reimu-sidebar-entry-hover" to "#eeeeee",
        "--reimu-sidebar-color" to "#fff",
        "--reimu-sidebar-font-color" to "#353535",
        "--reimu-embed-color" to "#fff",
        "--reimu-navbar-color" to "#ffffffa8",
        "--reimu-navbar-text-color" to "#2e3038",
        "--reimu-premium-card-background" to "#ffcdd8",
        "--reimu-premium-card-font-color" to "#333",
        "--reimu-default-font-color" to "#2e3038",
        "--reimu-border-color" to "#d1d1d1",
        "--reimu-searchbar-text" to "#000",
        "--reimu-searchbar-background" to "#fff",
        "--reimu-header-border" to "#c6c6c68f"
        )

    lightTheme.forEach { (key, value) ->
        root.style.setProperty(key, value)
    }

    themeSwitcherButton.innerHTML = Icons.MOON
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