package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.BirthdayEnableExecutor
import net.cakeyfox.foxy.interactions.vanilla.social.BirthdaySetExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class BirthdayCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("birthday", CommandCategory.SOCIAL) {
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )

        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)
        subCommand("set") {
            addOption(opt(OptionType.STRING, "date", true))
            executor = BirthdaySetExecutor()
        }

        subCommand("enable") { executor = BirthdayEnableExecutor() }
    }
}