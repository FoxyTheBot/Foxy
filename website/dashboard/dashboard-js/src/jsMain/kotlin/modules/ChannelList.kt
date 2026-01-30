package modules

import kotlinx.browser.document
import kotlinx.serialization.json.Json
import org.w3c.dom.*
import org.w3c.dom.asList

val blockedChannels = mutableListOf<String>()
val removedChannels = mutableListOf<String>()

fun setUpAddChannelButton() {
    document.getElementById("addChannelButton")?.addEventListener("click", {
        val select = document.getElementById("channelsToBlockCommands") as? HTMLSelectElement
        val selectedChannelId = select?.value
        val selectedChannelText = select?.options?.get(select.selectedIndex)?.textContent

        if (selectedChannelId != null && document.getElementById("channel-$selectedChannelId") == null) {
            blockedChannels.add(selectedChannelId)
            addChannelToDisplay(selectedChannelId, selectedChannelText!!)
            showActionsWrapper()
        }
    })

    installFormHandlers()
    installHtmxSyncHandler()
    installRemoveChannelHandler()
}

fun installFormHandlers() {
    document.addEventListener("htmx:configRequest", { event ->
        val detail = event.asDynamic().detail
        val params = detail.parameters

        params["blockedChannels"] = Json.encodeToString(blockedChannels)
        params["removedChannels"] = Json.encodeToString(removedChannels)
    })
}

fun installHtmxSyncHandler() {
        val mentions = document
            .querySelectorAll("#selectedChannels .channel-mention")
            .asList()
            .mapNotNull { (it as? HTMLElement)?.id }

        if (mentions.isEmpty()) {
            blockedChannels.clear()
            document.getElementById("selectedChannels")?.innerHTML = ""
            return
        }

    blockedChannels.clear()
    blockedChannels.addAll(
            mentions.map { it.removePrefix("channel-") }
        )
}

fun installRemoveChannelHandler() {
    val container = document.getElementById("selectedChannels") ?: return

    container.addEventListener("click", { event ->
        val target = event.target as? HTMLElement ?: return@addEventListener
        if (!target.classList.contains("remove-channel")) return@addEventListener

        event.stopPropagation()
        event.preventDefault()

        val parentSpan = target.parentElement ?: return@addEventListener
        container.removeChild(parentSpan)

        val channelId = parentSpan.id.removePrefix("channel-")
        blockedChannels.remove(channelId)
        removedChannels.add(channelId)
        showActionsWrapper()
    })
}

private fun addChannelToDisplay(channelId: String, textContent: String) {
    val channelDisplay = document.createElement("span") as HTMLSpanElement
    channelDisplay.className = "channel-mention"
    channelDisplay.id = "channel-$channelId"
    channelDisplay.innerText = "#$textContent"

    val removeButton = document.createElement("button") as HTMLButtonElement
    removeButton.type = "button"
    removeButton.className = "remove-channel"
    removeButton.innerText = "Remover"

    channelDisplay.appendChild(removeButton)
    document.getElementById("selectedChannels")?.appendChild(channelDisplay)
}