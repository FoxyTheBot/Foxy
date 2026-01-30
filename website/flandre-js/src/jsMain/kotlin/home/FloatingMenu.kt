package home

import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.HTMLElement
import org.w3c.dom.events.Event
import kotlin.math.max

fun setupFloatingMenu(buttonId: String, menuId: String) {
    val btn = document.getElementById(buttonId) as? HTMLElement ?: return
    val menu = document.getElementById(menuId) as? HTMLElement ?: return

    var hideTimer: Int? = null

    fun clearHideTimer() {
        hideTimer?.let { window.clearTimeout(it) }
    }

    fun measureMenuWidthHeight(): Pair<Double, Double> {
        val prevDisplay = menu.style.display
        val prevVisibility = menu.style.visibility

        menu.style.visibility = "hidden"
        menu.style.display = "block"

        val rect = menu.getBoundingClientRect()
        val w = rect.width
        val h = rect.height

        menu.style.display = prevDisplay
        menu.style.visibility = prevVisibility
        return Pair(w, h)
    }

    fun positionMenuBelowButton() {
        val rect = btn.getBoundingClientRect()
        val menuSize = measureMenuWidthHeight()
        val menuW = menuSize.first
        val menuH = menuSize.second

        val scrollX = window.pageXOffset
        val scrollY = window.pageYOffset

        var left = rect.left + scrollX
        var top = 45.0

        val vw = window.innerWidth.toDouble()
        val padding = 8.0
        if (left + menuW + padding > vw) {
            left = max(padding, vw - menuW - padding)
        }
        if (left < padding) left = padding

        val vh = window.innerHeight.toDouble()
        if (top + menuH > window.pageYOffset + vh - 8) {
            val altTop = rect.top + scrollY - menuH - 8.0
            top = if (altTop > 8) altTop else top
        }

        menu.style.left = "${left - 10}px"
        menu.style.top = "${top + 7}px"
    }

    fun openMenu() {
        clearHideTimer()
        positionMenuBelowButton()
        menu.classList.add("open")
        menu.style.display = "block"
        menu.style.opacity = "1"
    }

    fun closeMenu() {
        clearHideTimer()
        menu.classList.remove("open")
        menu.style.opacity = "0"
        menu.style.display = "none"
    }

    fun scheduleClose(delayMs: Int = 150) {
        clearHideTimer()
        hideTimer = window.setTimeout({
            closeMenu()
        }, delayMs)
    }

    btn.addEventListener("mouseenter", { _: Event -> openMenu() })
    btn.addEventListener("mouseleave", { _: Event -> scheduleClose() })
    menu.addEventListener("mouseenter", { _: Event -> openMenu() })
    menu.addEventListener("mouseleave", { _: Event -> scheduleClose() })

    btn.addEventListener("click", { e ->
        e.preventDefault()
        if (menu.classList.contains("open")) closeMenu() else openMenu()
    })

    document.addEventListener("click", { e ->
        val target = e.target as? HTMLElement ?: return@addEventListener
        if (target === btn || btn.contains(target)) return@addEventListener
        if (target === menu || menu.contains(target)) return@addEventListener
        closeMenu()
    })

    window.addEventListener("resize", { _: Event -> if (menu.classList.contains("open")) positionMenuBelowButton() })
    window.addEventListener("scroll", { _: Event -> if (menu.classList.contains("open")) positionMenuBelowButton() })
}