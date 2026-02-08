package net.cakeyfox.foxy.interactions.vanilla.discord.declarations

import dev.minn.jda.ktx.interactions.commands.Command
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.discord.UserAvatarExecutor
import net.cakeyfox.foxy.interactions.vanilla.discord.UserInfoExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.Command
import net.dv8tion.jda.api.interactions.commands.OptionType

class UserCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("user", CommandCategory.DISCORD) {
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)

        contextMenu(Command.Type.USER, this.name, UserInfoExecutor())
        subCommand("avatar") {
            addOption(opt(OptionType.USER, "user", true))

            enableLegacyMessageSupport = true
            executor = UserAvatarExecutor()
        }

        subCommand("info") {
            aliases = listOf("userinfo")
            addOption(opt(OptionType.USER, "user", false))
            enableLegacyMessageSupport = true
            executor = UserInfoExecutor()
        }
    }
}