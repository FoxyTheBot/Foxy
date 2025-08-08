package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.MarryAskExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class MarryCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("marry", CommandCategory.SOCIAL) {
        interactionContexts = listOf(InteractionContextType.GUILD, InteractionContextType.PRIVATE_CHANNEL)
        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)

        subCommand("ask") {
            addOption(opt(OptionType.USER, "user", true))
            supportsLegacy = true
            aliases = listOf("marry", "casar")
            executor = MarryAskExecutor()
        }

//        subCommand("leaderboard") { executor = MarryLeaderboardExecutor() }
    }
}