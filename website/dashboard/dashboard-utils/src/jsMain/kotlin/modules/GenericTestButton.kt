package modules

import io.ktor.client.HttpClient
import io.ktor.client.engine.js.Js
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.dom.addClass
import kotlinx.dom.removeClass
import kotlinx.serialization.json.Json
import net.cakeyfox.serializable.data.website.EventType
import net.cakeyfox.serializable.data.website.MessageSettings
import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.HTMLDivElement
import org.w3c.dom.HTMLFormElement
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.get
import org.w3c.xhr.FormData
import showLoading


fun setUpGenericTestButton(
    scope: CoroutineScope,
    httpClient: HttpClient,
    buttonId: String,
    endpoint: String,
    eventType: EventType,
) {
    val button = document.getElementById(buttonId) as? HTMLButtonElement
    val imageLink = Regex("https?://.*\\.(png|jpg|jpeg|gif|webp)", RegexOption.IGNORE_CASE)

    button?.addEventListener("click", {
        val form = document.querySelector(".config-module-form") as HTMLFormElement
        val guildId = button.attributes["guildId"]?.value ?: return@addEventListener
        val channelId = button.attributes["channelId"]?.value

        val formattedEndpoint = endpoint
            .replace("{guildId}", guildId)
            .replace("{channelId}", channelId ?: "")

        val formData = FormData(form)
        val idempotencyKey = form.getAttribute("idempotencyKey") ?: return@addEventListener println("Missing key")
        val saveButton = document.getElementById("saveButton") as? HTMLButtonElement
        val loadingOverlay = document.getElementById("loadingOverlay") as? HTMLDivElement
        val allowedPlaceholders = setOf("{user.avatar}", "{guild.icon}")

        fun validateImageField(
            elementId: String,
            value: String?
        ): Boolean {
            val v = value?.trim().orEmpty()

            val isValid = v.isEmpty() || v in allowedPlaceholders || imageLink.matches(v)

            if (!isValid) {
                val input = document.getElementById(elementId) as HTMLInputElement
                input.style.border = "2px solid red"
                input.classList.add("shake")

                window.setTimeout({
                    input.classList.remove("shake")
                }, 500)
            }

            return isValid
        }

        val prefix = getPrefix(eventType)

        val (thumbKey, imageKey) = when (eventType) {
            EventType.LEAVE, EventType.JOIN, EventType.DM -> "${prefix}EmbedThumbnail" to "${prefix}ImageLink"
            else -> "embedThumbnail" to "imageLink"
        }

        val thumbValue = formData.get(thumbKey)?.toString()
        val imageValue = formData.get(imageKey)?.toString()

        val thumbOk = validateImageField(thumbKey, thumbValue)
        val imageOk = validateImageField(imageKey, imageValue)

        if (!thumbOk || !imageOk) return@addEventListener

        val dataMap = formDataToMap(formData)

        val messageBody = when (eventType) {
            EventType.JOIN -> {
                MessageSettings(
                    channel = dataMap["welcomeChannel"],
                    content = dataMap["messageContent"],
                    embedTitle = dataMap["welcomeEmbedTitle"],
                    embedDescription = dataMap["welcomeEmbedDescription"],
                    embedThumbnail = dataMap["welcomeEmbedThumbnail"],
                    imageLink = dataMap["welcomeImageLink"],
                    embedFooter = dataMap["welcomeEmbedFooter"]
                )
            }

            EventType.DM -> {
                MessageSettings(
                    content = dataMap["dmMessageContent"],
                    embedTitle = dataMap["dmEmbedTitle"],
                    embedDescription = dataMap["dmEmbedDescription"],
                    embedThumbnail = dataMap["dmEmbedThumbnail"],
                    imageLink = dataMap["dmImageLink"],
                    embedFooter = dataMap["dmEmbedFooter"]
                )
            }

            EventType.LEAVE -> {
                MessageSettings(
                    channel = dataMap["leaveChannel"],
                    content = dataMap["leaveMessageContent"],
                    embedTitle = dataMap["leaveEmbedTitle"],
                    embedDescription = dataMap["leaveEmbedDescription"],
                    embedThumbnail = dataMap["leaveEmbedThumbnail"],
                    imageLink = dataMap["leaveImageLink"],
                    embedFooter = dataMap["leaveEmbedFooter"]
                )
            }

            EventType.ANY -> {
                MessageSettings(
                    channel = dataMap["channel"],
                    content = dataMap["messageContent"],
                    embedTitle = dataMap["embedTitle"],
                    embedDescription = dataMap["embedDescription"],
                    embedThumbnail = dataMap["embedThumbnail"],
                    imageLink = dataMap["imageLink"],
                    embedFooter = dataMap["embedFooter"]
                )
            }
        }

        saveButton?.disabled = true
        button.disabled = true
        saveButton?.addClass("disabled")
        button.addClass("disabled")
        println("a")
        try {
            scope.launch {
                val response = httpClient.post(formattedEndpoint) {
                    header("Foxy-Idempotency-Key", idempotencyKey)
                    contentType(ContentType.Application.Json)
                    setBody(messageBody)
                }

                if (response.status == HttpStatusCode.OK) {
                    loadingOverlay?.classList?.add("hidden")
                    saveButton?.disabled = false
                    button.disabled = false
                    saveButton?.removeClass("disabled")
                    button.removeClass("disabled")
                }
            }
        } catch (e: Exception) {
            println(e)
        }
    })
}

private fun getPrefix(eventType: EventType): String {
    return when (eventType) {
        EventType.JOIN, EventType.ANY -> "welcome"
        EventType.LEAVE -> "leave"
        EventType.DM -> "dm"
    }
}

private fun formDataToMap(formData: FormData): Map<String, String> {
    val map = mutableMapOf<String, String>()
    formData.asDynamic().forEach { value, key ->
        map[key] = value
    }

    return map
}