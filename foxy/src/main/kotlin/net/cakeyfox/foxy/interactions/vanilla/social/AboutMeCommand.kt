package net.cakeyfox.foxy.interactions.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class AboutMeCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("aboutme", CommandCategory.SOCIAL) {
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)
        addOption(opt(OptionType.STRING, "text", true))

        executor = AboutMeExecutor()
    }

    inner class AboutMeExecutor : FoxySlashCommandExecutor() {
        override suspend fun execute(context: FoxyInteractionContext) {
            val text = context.getOption<String>("text")!!

            if (text.length > 177) {
                context.reply {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["aboutme.tooLong"]
                    )
                }

                return
            }

            context.database.user.updateUser(
                context.event.user.id,
                mapOf("userProfile.aboutme" to text)
            )

            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyYay,
                    context.locale["aboutme.success", text]
                )
            }
        }
    }
}