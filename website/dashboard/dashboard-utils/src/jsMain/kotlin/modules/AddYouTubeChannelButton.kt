package modules

import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.url
import io.ktor.client.statement.bodyAsText
import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.dom.addClass
import kotlinx.html.div
import kotlinx.html.dom.append
import kotlinx.html.h1
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.html.stream.createHTML
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.HTMLFormElement
import org.w3c.dom.Node
import org.w3c.xhr.FormData
import showLoading

fun setUpYouTubeAddButtons(client: HttpClient, scope: CoroutineScope) {
    val button = document.getElementById("popUpAddChannelButton") as? HTMLButtonElement

    button?.addEventListener("click", {
        val form = document.querySelector("#youtubeAddChannelPopUp") as HTMLFormElement
        val formData = FormData(form)
        val channelName = formData.get("channelName").toString()
        val idempotencyKey = form.getAttribute("idempotencyKey")
        val guildId = button.getAttribute("guildId") ?: return@addEventListener
        if (channelName.isEmpty()) return@addEventListener

        scope.launch {
            showLoading()
            button.addClass("disabled")

            val response = client.post {
                this.url("/api/v1/servers/$guildId/modules/youtube/channel/add")
                this.header("Foxy-Idempotency-Key", idempotencyKey)
                this.setBody(channelName)
            }

            delay(500)
            window.location.replace(response.bodyAsText())
        }
    })
}
