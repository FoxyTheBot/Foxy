package net.cakeyfox.foxy.command.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty

class HelpExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.reply {
            embed {
                description = pretty(
                    FoxyEmotes.FoxyHowdy,
                    context.locale["help.description", context.user.asMention]
                )

                color = Colors.FOXY_DEFAULT
                thumbnail = context.foxy.selfUser.effectiveAvatarUrl

                field {
                    name = context.locale["help.field.addMe", FoxyEmotes.FoxyWow]
                    value = "[${context.locale["help.field.addMeValue"]}](${Constants.INVITE_LINK})"
                    inline = false
                }

                field {
                    name = context.locale["help.field.support", FoxyEmotes.FoxyHug]
                    value = Constants.SUPPORT_SERVER
                    inline = false
                }

                field {
                    name = context.locale["help.field.website", FoxyEmotes.FoxyCake]
                    value = Constants.FOXY_WEBSITE
                    inline = false
                }

                field {
                    name = context.locale["help.field.terms", FoxyEmotes.FoxyRage]
                    value = Constants.TERMS
                    inline = false
                }
            }
        }
    }
}