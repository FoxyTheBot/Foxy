package net.cakeyfox.foxy.interactions.vanilla.discord.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.discord.UserAvatarExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class UserCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("user", CommandCategory.DISCORD) {
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)

        subCommand("avatar") {
            addOption(opt(OptionType.USER, "user", true))
            supportsLegacy = true
            executor = UserAvatarExecutor()
        }
    }
}