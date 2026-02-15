package net.cakeyfox.foxy.website.frontend.pages

import kotlinx.html.FlowContent
import kotlinx.html.body
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.id
import kotlinx.html.main
import kotlinx.html.p
import kotlinx.html.span
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.website.frontend.utils.buildAd
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.getLanguage
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.FoxyCommand
import net.cakeyfox.serializable.data.website.Option
import net.cakeyfox.serializable.data.website.UserSession

fun commandPage(
    lang: String,
    user: UserSession?,
    isProduction: Boolean,
    commands: List<FoxyCommand>,
    locale: FoxyLocale,
): String {
    return createHTML().html {
        val locale = getLanguage(lang)

        head {
            buildHead(
                "Foxy | Comandos",
                "Veja minhas funcionalidades",
            )
        }

        body {
            headerWithUser(user, locale)

            main("commands-page") {
                h1("commands-title") { +"Comandos" }
                buildAd(false, isProduction)

                div("commands") {
                    commands.forEach { command ->
                        if (!command.subCommands.isNullOrEmpty()) {
                            command.subCommands?.forEach { sub ->
                                commandItem(
                                    name = "${command.commandName} ${sub.commandName}",
                                    description = sub.commandDescription,
                                    category = command.category!!,
                                        options = sub.options,
                                    locale = locale
                                )
                            }
                        } else {
                            commandItem(
                                name = command.commandName,
                                description = command.commandDescription,
                                category = command.category!!,
                                options = command.options,
                                locale = locale
                            )
                        }
                    }
                }
            }
        }
    }
}

fun FlowContent.commandItem(
    name: String,
    description: String,
    category: String,
    options: List<Option>,
    locale: FoxyLocale
) {
    div("command-item") {
        +"/$name"
        p {
            id = "commandDescription"
            +description
        }
        p {
            id = "commandCategory"
            +locale["categories.$category"]
        }

        if (options.isNotEmpty()) {
            div("expandable-command") {
                this.id = "expandableCommand"

                div("command-options") {
                    p {
                        id = "commandOptions"
                        +"Opções"
                    }

                    options.forEach { option ->
                        div("commandOption") {
                            div("commandInfoField") {
                                p {
                                    id = "optionInfo"
                                    +option.name
                                }

                                span {
                                    this.id = "requiredCard"
                                    if (option.required) {
                                        +"Requerido"
                                    } else +"Opcional"
                                }
                            }

                            p {
                                id = "optionDescription"
                                +option.description
                            }
                        }
                    }
                }
            }
            span("expand-arrow") {
                +"▼"
            }
        }
    }
}
