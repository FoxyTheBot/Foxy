import io.ktor.client.HttpClient
import io.ktor.client.engine.js.Js
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.browser.document
import kotlinx.coroutines.MainScope
import kotlinx.html.div
import kotlinx.html.dom.append
import kotlinx.html.h1
import kotlinx.html.id
import kotlinx.html.img
import kotlinx.serialization.json.Json
import modules.setUpActionsWrapper
import modules.setUpAddChannelButton
import modules.setUpAddRoleButton
import modules.setUpGenericTestButton
import modules.setUpGuildSearchBar
import modules.setUpGuildSelectMenu
import modules.setUpYouTubeAddButtons
import modules.setUpYouTubeRemoveButtons
import net.cakeyfox.serializable.data.website.EventType

val client = HttpClient(Js) {
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
            prettyPrint = true
        })
    }
}

val scope = MainScope()

fun main() {
    document.addEventListener("htmx:load", {
        setUpActionsWrapper()
        setUpGuildSearchBar()
        setUpAddChannelButton()
        setUpAddRoleButton()

        setUpGenericTestButton(
            scope = scope,
            httpClient = client,
            buttonId = "goodbyeTestButton",
            endpoint = "/api/v1/servers/{guildId}/modules/welcomer/sendGoodbyeTest",
            eventType = EventType.LEAVE
        )
        setUpGenericTestButton(
            scope = scope,
            httpClient = client,
            buttonId = "welcomeTestButton",
            endpoint = "/api/v1/servers/{guildId}/modules/welcomer/sendWelcomeTest",
            eventType = EventType.JOIN
        )
        setUpGenericTestButton(
            scope = scope,
            httpClient = client,
            buttonId = "welcomeDMTestButton",
            endpoint = "/api/v1/servers/{guildId}/modules/welcomer/sendDmWelcomeTest",
            eventType = EventType.DM
        )
        setUpGenericTestButton(
            scope = scope,
            httpClient = client,
            buttonId = "ytTestButton",
            endpoint = "/api/v1/servers/{guildId}/modules/youtube/{channelId}/sendTestMessage",
            eventType = EventType.ANY
        )

        setUpYouTubeRemoveButtons(client, scope)
        setUpYouTubeAddButtons(client, scope)
    })

    setUpGuildSelectMenu()
}

fun showLoading() {
    document.body?.append {
        div("loading-overlay") {
            id = "loadingOverlay"

            img (src = "/assets/emojis/foxypat-6.gif")
            h1("title") { +"Carregando" }
        }
    }
}