package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.AboutMeExecutor
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
            enableLegacyMessageSupport = true
            aliases = listOf("perfil", "profile")
            executor = ProfileViewExecutor()
        }

        subCommand("aboutme") {
            addOption(opt(OptionType.STRING, "text", true))
            enableLegacyMessageSupport = true
            aliases = listOf("sobremim")
            executor = AboutMeExecutor()
        }

        subCommand("badges") {
            enableLegacyMessageSupport = true
            aliases = listOf("insignías", "insignias")
            executor = ProfileBadgesExecutor()
        }
    }
}