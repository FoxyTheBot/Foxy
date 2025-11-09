package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.GiveRepExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class RepCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("rep", CommandCategory.SOCIAL) {
        supportsLegacy = true
        integrationType = listOf(
            IntegrationType.USER_INSTALL,
            IntegrationType.GUILD_INSTALL
        )
        interactionContexts = listOf(
            InteractionContextType.PRIVATE_CHANNEL,
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD
        )

        subCommand("give") {
            aliases = listOf("rep")
            supportsLegacy = true
            addOption(opt(OptionType.USER, "user", true))
            addOption(opt(OptionType.STRING, "reason", true))

            executor = GiveRepExecutor()
        }
    }
}