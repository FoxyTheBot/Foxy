package frontend.htmx.partials

import kotlinx.html.ButtonType
import kotlinx.html.InputType
import kotlinx.html.br
import kotlinx.html.button
import kotlinx.html.div
import kotlinx.html.id
import kotlinx.html.input
import kotlinx.html.label
import kotlinx.html.script
import kotlinx.html.select
import kotlinx.html.textArea
import kotlinx.serialization.json.Json
import net.cakeyfox.common.FoxyLocale
import frontend.utils.buildExpandableModuleEntry
import frontend.utils.buildGenericEmbed
import frontend.utils.buildModuleForm
import frontend.utils.buildToggleableEntry
import frontend.utils.buildToggleableTextField
import frontend.utils.getChannelList
import frontend.utils.renderPopUp
import kotlinx.html.classes
import kotlinx.html.img
import kotlinx.html.onClick
import kotlinx.html.option
import kotlinx.html.stream.createHTML
import kotlinx.html.style
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.serializable.data.utils.DiscordMessageBody
import net.cakeyfox.serializable.data.website.DiscordChannel

fun getWelcomerSettings(guild: Guild, locale: FoxyLocale, channels: List<DiscordChannel>, idempotencyKey: String): String {
    return createHTML().div {
        renderPopUp(
            "Importar JSON",
            "Importe mensagens em JSON de outros bots para a Foxy!",
            "importForm",
            idempotencyKey = idempotencyKey,
            extraButtonBlock = {
                button(type = ButtonType.button) {
                    id = "import"
                    classes = setOf("popup-button")
                    +"Importar"
                }
            }

        ) {
            div("form-group") {
                style = """
                    display: flex;
                    align-items: center;
                    gap: 51%;
                    width: 100%;
                """.trimIndent()

                div {
                    label {
                        htmlFor = "botSelect"
                        +"Selecione o bot:"
                    }

                    select {
                        id = "botSelect"
                        name = "botSelect"
                        required = true
                        attributes["onchange"] = "updateBotImage()"
                        style = "width: 250%;"
                        attributes["data-gtm-form-interact-field-id"] = "0"

                        option {
                            value = ""
                            disabled = true
                            selected = true
                            +"Escolha um bot"
                        }
                        option {
                            value = "loritta"
                            +"Loritta"
                        }
                        option {
                            value = "carl-bot"
                            +"Carl Bot"
                        }
                    }
                }

                div {
                    id = "botImageContainer"
                    style = "text-align: center;"

                    img(src = "https://cdn.discordapp.com/embed/avatars/0.png") {
                        id = "botImage"
                        style = "max-width: 85px;display: block;border-radius: 50%;"
                    }
                }
            }

            div("form-group") {
                label {
                    htmlFor = "jsonInput"
                    +"Cole o JSON:"
                }
                textArea {
                    id = "jsonInput"
                    name = "jsonInput"
                    rows = "8"
                    placeholder = "Cole o JSON aqui..."
                    required = true
                }
            }
        }

        buildModuleForm(
            "getWelcomerSettings",
            formAction = "/api/v1/servers/${guild._id}/modules/welcomer",
            locale,
            idempotencyKey
        ) {
            val joinMessage = Json.decodeFromString<DiscordMessageBody>(
                guild.GuildJoinLeaveModule.joinMessage ?: "{ \"content\": \"Oi!\"}"
            )
            val dmMessage = Json.decodeFromString<DiscordMessageBody>(
                guild.GuildJoinLeaveModule.dmWelcomeMessage ?: "{ \"content\": \"Oi!\"}"
            )
            val leaveMessage = Json.decodeFromString<DiscordMessageBody>(
                guild.GuildJoinLeaveModule.leaveMessage ?: "{ \"content\": \"Oi!\"}"
            )

            buildExpandableModuleEntry(
                entryName = "Enviar mensagem quando alguém entrar no servidor",
                entryId = "toggleWelcomeModule",
                defaultValue = guild.GuildJoinLeaveModule.isEnabled,
                optionsId = "toggleableWelcomeOptions"
            ) {
                buildToggleableEntry(
                    entryName = "Selecione um canal de boas-vindas",
                    classes = "toggleable-option-title"
                ) {
                    select {
                        name = "welcomeChannel"
                        id = "welcomeChannel"

                        getChannelList(channels, guild.GuildJoinLeaveModule.joinChannel)
                    }
                }

                buildToggleableEntry("Mensagem de boas-vindas") {
                    div("button-wrapper") {
                        button {
                            this.id = "welcomeTestButton"
                            type = ButtonType.button
                            attributes["guildId"] = guild._id
                            +"Testar Mensagem"
                        }
                        button {
                            this.id = "welcomeImportJsonButton"
                            type = ButtonType.button
                            onClick = "showPopup('welcome')"
                            attributes["data-module-type"] = "welcome"
                            +"Importar JSON"
                        }
                    }

                    br { }

                    buildToggleableTextField(
                        entryName = "Conteúdo da Mensagem",
                        entryId = "messageContent",
                        entryPlaceholder = "Conteúdo da Mensagem",
                        defaultValue = joinMessage.content
                    )

                    buildGenericEmbed(joinMessage, "welcome")
                }
            }

            buildExpandableModuleEntry(
                entryName = "Enviar mensagem direta quando alguém entrar no servidor",
                entryId = "toggleDMWelcomeModule",
                defaultValue = guild.GuildJoinLeaveModule.sendDmWelcomeMessage,
                optionsId = "toggleableDMWelcomeOptions"
            ) {
                buildToggleableEntry("Mensagem de boas-vindas no privado") {
                    div("button-wrapper") {
                        button {
                            this.id = "welcomeDMTestButton"
                            attributes["guildId"] = guild._id
                            type = ButtonType.button
                            +"Testar Mensagem"
                        }
                        button {
                            this.id = "welcomeDMImportJsonButton"
                            type = ButtonType.button
                            onClick = "showPopup('dm')"
                            attributes["data-module-type"] = "dm"
                            +"Importar JSON"
                        }
                    }

                    br {}

                    buildToggleableTextField(
                        entryName = "Conteúdo da Mensagem",
                        entryId = "DmMessageContent",
                        entryPlaceholder = "Conteúdo da Mensagem",
                        defaultValue = dmMessage.content
                    )

                    buildGenericEmbed(dmMessage, "dm")
                }
            }

            buildExpandableModuleEntry(
                entryName = "Enviar mensagem quando alguém sair do servidor",
                entryId = "toggleLeaveModule",
                defaultValue = guild.GuildJoinLeaveModule.alertWhenUserLeaves,
                optionsId = "toggleableLeaveOptions"
            ) {
                buildToggleableEntry(
                    entryName = "Selecione um canal de saída",
                    classes = "toggleable-option-title"
                ) {
                    select {
                        name = "leaveChannel"
                        id = "leaveChannel"

                        getChannelList(channels, guild.GuildJoinLeaveModule.leaveChannel)
                    }
                }

                buildToggleableEntry("Mensagem de saída") {
                    div("button-wrapper") {
                        button {
                            this.id = "goodbyeTestButton"
                            attributes["guildId"] = guild._id
                            type = ButtonType.button
                            +"Testar Mensagem"
                        }
                        button {
                            this.id = "leaveImportJsonButton"
                            type = ButtonType.button
                            onClick = "showPopup('leave')"
                            attributes["data-module-type"] = "leave"
                            +"Importar JSON"
                        }
                    }

                    br {}

                    buildToggleableTextField(
                        entryName = "Conteúdo da Mensagem",
                        entryId = "leaveMessageContent",
                        entryPlaceholder = "Conteúdo da Mensagem",
                        defaultValue = leaveMessage.content
                    )

                    buildGenericEmbed(leaveMessage, "leave")
                }
            }
        }
    }
}
