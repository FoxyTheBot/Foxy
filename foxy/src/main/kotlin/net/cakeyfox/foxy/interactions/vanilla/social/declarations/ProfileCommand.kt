package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.ProfileBadgesExecutor
import net.cakeyfox.foxy.interactions.vanilla.social.ProfileViewExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class ProfileCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("profile", CommandCategory.SOCIAL) {
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL,
            InteractionContextType.BOT_DM
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)

        subCommand("view") {
            addOption(opt(OptionType.USER, "user"))

            executor = ProfileViewExecutor()
        }

        subCommand("badges") { executor = ProfileBadgesExecutor() }
    }
}