package frontend.utils

import io.ktor.htmx.HxSwap
import io.ktor.htmx.html.hx
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.html.ButtonType
import kotlinx.html.DIV
import kotlinx.html.FORM
import kotlinx.html.FlowContent
import kotlinx.html.FormMethod
import kotlinx.html.InputType
import kotlinx.html.body
import kotlinx.html.br
import kotlinx.html.button
import kotlinx.html.div
import kotlinx.html.form
import kotlinx.html.h3
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.id
import kotlinx.html.input
import kotlinx.html.label
import kotlinx.html.onClick
import kotlinx.html.option
import kotlinx.html.script
import kotlinx.html.select
import kotlinx.html.span
import kotlinx.html.stream.createHTML
import kotlinx.html.style
import kotlinx.html.textArea
import kotlinx.html.unsafe
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.foxy.website.frontend.utils.isLoading
import net.cakeyfox.serializable.data.utils.DiscordMessageBody
import net.cakeyfox.serializable.data.website.DiscordChannel
import net.cakeyfox.serializable.data.website.DiscordServer
import net.cakeyfox.serializable.data.website.UserSession

@OptIn(ExperimentalKtorApi::class)
fun FlowContent.buildModuleForm(
    formId: String,
    formAction: String,
    locale: FoxyLocale,
    idempotencyKey: String,
    body: FORM.() -> Unit
) {
    form(classes = "config-module-form") {
        this.id = formId
        this.action = formAction
        this.method = FormMethod.post
        this.attributes["idempotencyKey"] = idempotencyKey

        attributes.hx {
            post = formAction
            target = "#$formId"
        }

        body()

        getActionWrapper(locale, formId, formAction)
    }
}

fun FORM.buildTextModuleEntry(
    entryName: String,
    entryId: String,
    entryPlaceholder: String,
    defaultValue: String,
    isRequired: Boolean
) {
    return buildGenericModuleEntry(entryName) {
        div {
            input(type = InputType.text) {
                name = entryId
                id = entryId
                placeholder = entryPlaceholder
                maxLength = "10"
                minLength = "1"
                required = isRequired
                style = "width: 50%"

                value = defaultValue
            }
        }
    }
}

fun DIV.buildSimpleChannelSelector(
    channels: List<DiscordChannel>,
    locale: FoxyLocale,
    selectorName: String,
    defaultValue: String?
) {
    div("channel-selector") {
        select {
            name = selectorName
            id = "channelSelector"

            channels.forEach { channel ->
                option {
                    this.id = channel.id
                    this.value = channel.id
                    this.selected = defaultValue == channel.id
                    +channel.name
                }
            }
        }
    }
}

fun FORM.buildExpandableModuleEntry(
    entryName: String,
    entryId: String,
    defaultValue: Boolean,
    optionsId: String,
    builder: DIV.() -> Unit
) {
    return buildGenericModuleEntry(entryName) {
        label("switch") {
            input(type = InputType.checkBox) {
                id = entryId
                name = entryId
                checked = defaultValue
            }
            span("slider round")
        }

        div(classes = "toggleable-options hidden") {
            this.id = optionsId

            builder()
        }

        script {
            unsafe {
                +"""
            (function() {
                const entryElement = document.getElementById("$entryId");
                const optionsElement = document.getElementById("$optionsId");

                if ($defaultValue === true) {
                    optionsElement.classList.remove("hidden", entryElement.checked);
                }
                
                entryElement.addEventListener("change", function () {
                    optionsElement.classList.toggle("hidden", !entryElement.checked);
                });
            })();
        """.trimIndent()
            }
        }
    }
}

fun DIV.buildGenericEmbed(messageBody: DiscordMessageBody, prefix: String) {
    return buildToggleableEntry("Configurar Embed", "embed-config") {
        br {}
        br {}

        div {
            label("toggleable-option-title") { +"Título da Embed" }
            input(InputType.text) {
                name = "${prefix}EmbedTitle"
                id = "${prefix}EmbedTitle"
                placeholder = "Título da Embed"
                value = messageBody.embeds?.firstOrNull()?.title ?: ""
            }
        }

        div {
            label("toggleable-option-title") { +"Descrição da Embed" }
            textArea {
                name = "${prefix}EmbedDescription"
                id = "${prefix}EmbedDescription"
                rows = "10"
                cols = "50"
                placeholder = "A Foxy é fofa!"
                +messageBody.embeds?.firstOrNull()?.description.orEmpty()
            }
        }

        div {
            label("toggleable-option-title") { +"Thumbnail da Embed" }
            input(InputType.text) {
                name = "${prefix}EmbedThumbnail"
                id = "${prefix}EmbedThumbnail"
                placeholder = "Link da Thumbnail"
                value = messageBody.embeds?.firstOrNull()?.thumbnail?.url ?: ""
            }
        }

        div {
            label("toggleable-option-title") { +"Imagem da Embed" }
            input(InputType.text) {
                name = "${prefix}ImagePrefix"
                id = "${prefix}ImagePrefix"
                placeholder = "Link da Imagem"
                value = messageBody.embeds?.firstOrNull()?.image?.url ?: ""
            }
        }

        div {
            label("toggleable-option-title") { +"Footer da Embed" }
            input(InputType.text) {
                name = "${prefix}EmbedFooter"
                id = "${prefix}EmbedFooter"
                placeholder = "Footer da Embed"
                value = messageBody.embeds?.firstOrNull()?.footer?.text ?: ""
            }
        }
    }
}

fun DIV.buildToggleableEntry(
    entryName: String,
    classes: String? = "",
    builder: DIV.() -> Unit
) {
    return div("toggleable-option $classes") {
        label("module-name") { +entryName }
        builder()
    }
}

fun DIV.buildStandardTextField(
    entryName: String,
    entryId: String,
    entryPlaceholder: String,
    defaultValue: String?,
    ) {
    return div {
        label("standard-text-input") { +entryName }
        input(InputType.text) {
            this.name = entryId
            this.id = entryId
            this.placeholder = entryPlaceholder
            this.value = defaultValue ?: ""
        }
    }
}


fun DIV.buildToggleableTextField(
    entryName: String,
    entryId: String,
    entryPlaceholder: String,
    defaultValue: String?,

) {
    return div {
        label("toggleable-option-title") { +entryName }
        input(InputType.text) {
            this.name = entryId
            this.id = entryId
            this.placeholder = entryPlaceholder
            this.value = defaultValue ?: ""
        }
    }
}

fun DIV.buildToggleableColorPicker() {

}

fun FORM.buildSliderModuleEntry(entryName: String, entryId: String, defaultValue: Boolean) {
    return buildGenericModuleEntry(entryName) {
        label("switch") {
            input(type = InputType.checkBox) {
                id = entryId
                name = entryId
                checked = defaultValue
            }
            span("slider round")
        }
    }
}

fun FORM.buildGenericModuleEntry(entryName: String, builder: DIV.() -> Unit) {
    return div("config-module") {
        label("module-name") { +entryName }
        builder()
    }
}

@OptIn(ExperimentalKtorApi::class)
fun FlowContent.getActionWrapper(locale: FoxyLocale, formId: String, endpoint: String) {
    div("actions-wrapper") {
        h3("save-message") { +locale["dashboard.actionWrapper.saveCard"] }
        div("actions") {
            button {
                id = "cancelButton"
                type = ButtonType.button
                onClick = "window.location.reload()"

                +locale["dashboard.actionWrapper.cancelButton"]
            }

            button {
                id = "saveButton"
                type = ButtonType.submit

                +locale["dashboard.actionWrapper.saveButton"]
            }
        }
    }
}

@OptIn(ExperimentalKtorApi::class)
fun buildDashboardModule(
    session: UserSession?,
    titleText: String,
    moduleTitle: String,
    moduleDescription: String,
    currentGuild: Guild,
    locale: FoxyLocale,
    isProduction: Boolean,
    isFoxyverseGuild: Boolean,
    partialUrl: String,
    availableGuilds: List<DiscordServer>,
    moduleId: String
): String {
    return createHTML().html {
        head {
            buildHead(
                titleText = titleText,
                description = moduleDescription,
                url = "https://foxybot.xyz/br/dashboard",
                isDashboard = true
            )
        }

        body {
            buildAd(true, isProduction)
            headerWithUser(session, locale)
            renderGuildSidebar(isFoxyverseGuild, currentGuild, locale, availableGuilds, moduleId)

            div("config-wrapper") {
                div("config-module-wrapper") {
                    attributes.hx {
                        get = partialUrl
                        trigger = "load"
                        target = ".config-module-wrapper"
                        swap = HxSwap.innerHtml
                    }

                    isLoading()
                }
            }

            div("notifications-container") { }
        }
    }
}