package net.cakeyfox.foxy.interactions.vanilla.utils

import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.Section
import dev.minn.jda.ktx.interactions.components.Separator
import dev.minn.jda.ktx.interactions.components.TextDisplay
import dev.minn.jda.ktx.interactions.components.Thumbnail
import dev.minn.jda.ktx.interactions.components.row
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.Type
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.componentMsg
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.components.separator.Separator

class HelpExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.reply {
            embed {
                description = pretty(
                    FoxyEmotes.FoxyHowdy,
                    context.locale["help.description", context.user.asMention],
                    ""
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

            actionRow(
                linkButton(
                    FoxyEmotes.Twitter,
                    "Twitter",
                    "https://x.com/FoxyTheBot"
                ),
                linkButton(
                    FoxyEmotes.Instagram,
                    "Instagram",
                    "https://www.instagram.com/foxythebot"
                ),
                linkButton(
                    FoxyEmotes.YouTube,
                    "YouTube",
                    "https://www.youtube.com/@foxythebot"
                ),
                linkButton(
                    FoxyEmotes.TikTok,
                    "TikTok",
                    "https://www.tiktok.com/@foxydiscordbot"
                ),
            )
        }
    }
}