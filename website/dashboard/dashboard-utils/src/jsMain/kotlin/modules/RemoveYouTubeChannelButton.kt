package modules

import io.ktor.client.HttpClient
import io.ktor.client.request.post
import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.dom.addClass
import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.asList
import showLoading

fun setUpYouTubeRemoveButtons(client: HttpClient, scope: CoroutineScope) {
    val buttons = document.querySelectorAll("[data-remove-youtube]").asList()

    buttons.forEach { element ->
        val button = element as HTMLButtonElement

        button.addEventListener("click", {
            val channelId = button.getAttribute("channelId")
            val guildId = button.getAttribute("guildId")

            scope.launch {
                showLoading()
                buttons.forEach {
                    val button = it as HTMLButtonElement
                    button.addClass("disabled")
                }

                client.post("/api/v1/servers/$guildId/modules/youtube/$channelId/remove")

                window.location.reload()
            }

        })
    }
}
