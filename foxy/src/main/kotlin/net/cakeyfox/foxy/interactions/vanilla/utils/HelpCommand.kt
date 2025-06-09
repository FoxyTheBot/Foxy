package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class HelpCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("help", CommandCategory.UTILS) {
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)

        executor = HelpExecutor()
    }

    inner class HelpExecutor : FoxySlashCommandExecutor() {
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
}