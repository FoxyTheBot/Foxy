package modules

import kotlinx.browser.document
import kotlinx.serialization.json.Json
import org.w3c.dom.*
import org.w3c.dom.asList

val addedRoles = mutableListOf<String>()
val removedRoles = mutableListOf<String>()

fun setUpAddRoleButton() {
    document.getElementById("addRoleButton")?.addEventListener("click", {
        val select = document.getElementById("rolesToAdd") as? HTMLSelectElement
        val selectedRoleId = select?.value
        val selectedChannelText = select?.options?.get(select.selectedIndex)?.textContent

        if (selectedRoleId != null && document.getElementById("role-$selectedRoleId") == null) {
            addedRoles.add(selectedRoleId)
            addRoleToDisplay(selectedRoleId, selectedChannelText!!)
            showActionsWrapper()
        }
    })

    installRoleFormHandlers()
    installRoleHtmxSyncHandler()
    installRemoveRoleHandler()
}

fun installRoleFormHandlers() {
    document.addEventListener("htmx:configRequest", { event ->
        val detail = event.asDynamic().detail
        val params = detail.parameters

        params["addedRoles"] = Json.encodeToString(addedRoles)
        params["removedRoles"] = Json.encodeToString(removedRoles)
    })
}

fun installRoleHtmxSyncHandler() {
    val mentions = document
        .querySelectorAll("#addedRoles .channel-mention")
        .asList()
        .mapNotNull { (it as? HTMLElement)?.id }

    if (mentions.isEmpty()) {
        addedRoles.clear()
        document.getElementById("addedRoles")?.innerHTML = ""
        return
    }

    addedRoles.clear()
    addedRoles.addAll(
        mentions.map { it.removePrefix("role-") }
    )
}

fun installRemoveRoleHandler() {
    val container = document.getElementById("addedRoles") ?: return

    container.addEventListener("click", { event ->
        val target = event.target as? HTMLElement ?: return@addEventListener
        if (!target.classList.contains("remove-role")) return@addEventListener

        event.stopPropagation()
        event.preventDefault()

        val parentSpan = target.parentElement ?: return@addEventListener
        container.removeChild(parentSpan)

        val roleId = parentSpan.id.removePrefix("role-")
        addedRoles.remove(roleId)
        removedRoles.add(roleId)
        showActionsWrapper()
    })
}

private fun addRoleToDisplay(channelId: String, textContent: String) {
    val channelDisplay = document.createElement("span") as HTMLSpanElement
    val roleOption = document.getElementById(channelId) as HTMLOptionElement
    val colorAttr = roleOption.getAttribute("color") as String
    val colorDecimal = colorAttr.toInt()
    val colorHex = "#" + colorDecimal.toString(16).padStart(6, '0')

    channelDisplay.className = "channel-mention"
    channelDisplay.id = "role-$channelId"
    channelDisplay.innerText = "@$textContent"
    channelDisplay.style.color = colorHex


    val removeButton = document.createElement("button") as HTMLButtonElement
    removeButton.type = "button"
    removeButton.className = "remove-role"
    removeButton.innerText = "Remover"

    channelDisplay.appendChild(removeButton)
    document.getElementById("addedRoles")?.appendChild(channelDisplay)
}