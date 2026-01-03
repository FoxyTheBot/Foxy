package frontend.htmx.partials

import frontend.utils.buildExpandableModuleEntry
import frontend.utils.buildGenericModuleEntry
import frontend.utils.buildModuleForm
import frontend.utils.buildSliderModuleEntry
import kotlinx.html.ButtonType
import kotlinx.html.button
import kotlinx.html.classes
import kotlinx.html.div
import kotlinx.html.id
import kotlinx.html.label
import kotlinx.html.option
import kotlinx.html.select
import kotlinx.html.span
import kotlinx.html.stream.createHTML
import kotlinx.html.style
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.serializable.data.website.DiscordRole

fun getAutoRoleSettings(
    guild: Guild,
    locale: FoxyLocale,
    roles: List<DiscordRole>,
    addedRoles: List<String>,
    idempotencyKey: String
): String {
    return createHTML().div {
        buildModuleForm(
            formId = "AutoRoleForm",
            formAction = "/api/v1/servers/${guild._id}/modules/autorole",
            locale = locale,
            idempotencyKey = idempotencyKey
        ) {
            buildExpandableModuleEntry(
                entryName = locale["enableModule"],
                entryId = "enableAutoRole",
                defaultValue = guild.AutoRoleModule?.isEnabled ?: false,
                optionsId = "autoRoleOptions",
            ) {
                label("module-name") { +locale["dashboard.modules.autorole.rolesToAdd.title"] }

                div("channel-selector") {
                    select {
                        name = "rolesToAdd"
                        id = "rolesToAdd"

                        roles.forEach { role ->
                            option {
                                this.attributes["color"] = role.colors.primaryColor.toString()
                                this.id = role.id
                                this.value = role.id
                                +role.name
                            }
                        }
                    }
                    button {
                        id = "addRoleButton"
                        type = ButtonType.button
                        +locale["dashboard.modules.autorole.rolesToAdd.addRoleButton"]
                    }
                }

                div(classes = "selected-channels") {
                    id = "addedRoles"

                    addedRoles.forEach { roleId ->
                        span {
                            this.id = "role-$roleId"
                            this.classes = setOf("channel-mention")
                            val role = roles.find { it.id == roleId }

                            val colorHex = "#" + role?.colors?.primaryColor?.toString(16)?.padStart(6, '0')

                            this.style = "color: $colorHex"

                            +"@${role?.name ?: "Unknown"}"

                            button {
                                this.id = "roleToAdd-$roleId"
                                this.classes = setOf("remove-role")
                                this.type = ButtonType.button

                                +"Remover"
                            }
                        }
                    }
                }
            }
        }
    }
}