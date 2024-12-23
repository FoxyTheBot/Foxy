package net.cakeyfox.foxy.command.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor

class HelpExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.reply {
            embed {
                description = context.prettyResponse {
                    emoteId = FoxyEmotes.FoxyHowdy
                    content = context.locale["help.description", context.user.asMention]
                }
                color = Colors.FOXY_DEFAULT
                thumbnail = context.instance.jda.selfUser.effectiveAvatarUrl
                // Yes, using "emoji" instead of emoji name will work
                field {
                    name = context.locale["help.field.addMe", "<:emoji:${FoxyEmotes.FoxyWow}>"]
                    value = "[${context.locale["help.field.addMeValue"]}](${Constants.INVITE_LINK})"
                    inline = false
                }

                field {
                    name = context.locale["help.field.support", "<:emoji:${FoxyEmotes.FoxyHug}>"]
                    value = Constants.SUPPORT_SERVER
                    inline = false
                }

                field {
                    name = context.locale["help.field.website", "<:emoji:${FoxyEmotes.FoxyCupcake}>"]
                    value = Constants.FOXY_WEBSITE
                    inline = false
                }

                field {
                    name = context.locale["help.field.terms", "<:emoji:${FoxyEmotes.FoxyRage}>"]
                    value = Constants.TERMS
                    inline = false
                }
            }
        }
    }
}