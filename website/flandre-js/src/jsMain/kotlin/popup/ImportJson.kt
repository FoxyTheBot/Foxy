package popup

import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.serialization.json.Json
import modules.showToast
import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.HTMLFormElement
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.HTMLTextAreaElement
import org.w3c.dom.HTMLSelectElement

private val json = Json {
    ignoreUnknownKeys = true
    coerceInputValues = true
}

fun setUpImportFromJson(type: String) {
    val importButton = document.getElementById("import") as? HTMLButtonElement ?: return

    importButton.addEventListener("click", { event ->
        event.preventDefault()

        val jsonInputArea = document.getElementById("jsonInput") as? HTMLTextAreaElement
        val botSelectElement = document.getElementById("botSelect") as? HTMLSelectElement

        val jsonInput = jsonInputArea?.value ?: ""
        val botSelect = botSelectElement?.value ?: ""

        if (jsonInput.isBlank()) {
            return@addEventListener
        }

        try {
            when (botSelect) {
                "loritta" -> {
                    val data = getLorittaMessageBody(jsonInput)
                    fillFieldsFromLoritta(type, data)
                }
                "carl-bot" -> {
                    val data = getCarlbotMessageBody(jsonInput)
                    fillFieldsFromCarlbot(type, data)
                }
                else -> {
                    showToast("Selecione um bot válido!", "error")
                }
            }

            showToast("Mensagem importada com sucesso!")
            hidePopup()
        } catch (e: Exception) {
            showToast("Falha ao importar mensagem ${e.message}", "error")
            e.printStackTrace()
        }
    })
}

private fun fillFieldsFromLoritta(type: String, data: LorittaMessage) {
    val prefix = getPrefix(type)
    val contentId = if (type == "welcome") "messageContent" else "${prefix}MessageContent"

    setFieldValue(contentId, data.content)

    data.embed?.let { embed ->
        setFieldValue("${prefix}EmbedTitle", embed.title)
        setFieldValue("${prefix}EmbedDescription", embed.description)
        setFieldValue("${prefix}EmbedThumbnail", embed.thumbnail?.url)
        setFieldValue("${prefix}ImageLink", embed.image?.url)
        setFieldValue("${prefix}EmbedFooter", embed.footer?.text)
    } ?: return
}

private fun fillFieldsFromCarlbot(type: String, data: CarlbotMessage) {
    val prefix = getPrefix(type)
    setFieldValue("${prefix}EmbedTitle", data.title)
    setFieldValue("${prefix}EmbedDescription", data.description)
    setFieldValue("${prefix}EmbedThumbnail", data.thumbnail?.url)
    setFieldValue("${prefix}ImageLink", data.image?.url)
    setFieldValue("${prefix}EmbedFooter", data.footer?.text)
}

private fun getPrefix(type: String): String {
    val p = when (type) {
        "welcome" -> "welcome"
        "dm" -> "dm"
        "leave" -> "leave"
        else -> ""
    }

    return p
}

private fun setFieldValue(id: String, value: String?) {
    val element = document.getElementById(id) ?: return

    val v = value ?: ""
    when (element) {
        is HTMLInputElement -> {
            element.value = v
        }
        is HTMLTextAreaElement -> {
            element.value = v
        }
        else -> { }
    }
}

fun getCarlbotMessageBody(input: String): CarlbotMessage {
    val decoded = json.decodeFromString<CarlbotMessage>(input)

    if (decoded.title.isNullOrBlank() && decoded.description.isNullOrBlank()) {
        showToast("A Mensagem deve conter conteúdo ou pelo menos uma embed", "error")
    }

    return decoded
}

fun getLorittaMessageBody(input: String): LorittaMessage {
    val decoded = json.decodeFromString<LorittaMessage>(input)

    if (decoded.content.isNullOrBlank() && decoded.embed?.title.isNullOrBlank()) {
        showToast("A Mensagem deve conter conteúdo ou pelo menos uma embed", "error")
    }

    return decoded
}