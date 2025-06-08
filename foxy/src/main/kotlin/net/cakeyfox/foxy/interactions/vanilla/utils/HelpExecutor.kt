package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class HelpExecutor : CommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.reply {
            embed {
                description = pretty(
                    FoxyEmotes.FoxyHowdy,
                    context.locale["help.description", context.user.asMention]
                )

                color = Colors.FOXY_DEFAULT
                thumbnail = context.jda.selfUser.effectiveAvatarUrl

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