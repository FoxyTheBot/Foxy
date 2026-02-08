package net.cakeyfox.foxy.interactions.vanilla.actions.declarations

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.actions.*
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType

class RoleplayCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("actions", CommandCategory.ACTIONS) {
        interactionContexts = listOf(InteractionContextType.GUILD, InteractionContextType.PRIVATE_CHANNEL)
        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)
        
        subCommand("kiss") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = RoleplayActionExecutor(canDoWithBot = false, canRetribute = true, FoxyEmotes.FoxyBread)
        }

        subCommand("hug") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )

            executor = RoleplayActionExecutor(canDoWithBot = true, canRetribute = true, FoxyEmotes.FoxyHug)
        }

        subCommand("pat") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = RoleplayActionExecutor(canDoWithBot = true, canRetribute = true, FoxyEmotes.FoxyBread)
        }

        subCommand("slap") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = RoleplayActionExecutor(canDoWithBot = true, canRetribute = true, FoxyEmotes.FoxyRage)
        }
    }
}