package net.cakeyfox.foxy.interactions.vanilla.actions.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.actions.*
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ActionsCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("actions", CommandCategory.ACTIONS) {
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(
            IntegrationType.GUILD_INSTALL,
            IntegrationType.USER_INSTALL
        )

        subCommand("laugh") { executor = LaughExecutor() }

        subCommand("dance") { executor = DanceExecutor() }

        subCommand("smile") { executor = SmileExecutor() }

        subCommand("kiss") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = KissExecutor()
        }

        subCommand("bite") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = BiteExecutor()
        }


        subCommand("hug") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )

            executor = HugExecutor()
        }

        subCommand("pat") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = PatExecutor()
        }

        subCommand("lick") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = LickExecutor()
        }

        subCommand("slap") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = SlapExecutor()
        }

        subCommand("tickles") {
            executor = TickleExecutor()

            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
        }
    }
}