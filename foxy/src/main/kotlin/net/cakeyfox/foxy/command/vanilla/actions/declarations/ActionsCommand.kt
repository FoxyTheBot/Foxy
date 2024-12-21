package net.cakeyfox.foxy.command.vanilla.actions.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.actions.*
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class ActionsCommand: FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "actions",
        "actions.description"
    ) {
        baseName = this@command.name

        subCommand("kiss", "actions.kiss.description") {
            baseName = this@command.name
            addOption(
                OptionData(
                    OptionType.USER,
                    "user",
                    "actions.kiss.options.user",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
            executor = KissExecutor()
        }

        subCommand("bite", "actions.bite.description") {
            baseName = this@command.name
            addOption(
                OptionData(
                    OptionType.USER,
                    "user",
                    "actions.bite.options.user",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
            executor = BiteExecutor()
        }

        subCommand("dance", "actions.dance.description") {
            baseName = this@command.name
            executor = DanceExecutor()
        }

        subCommand("hug", "actions.hug.description") {
            baseName = this@command.name

            addOption(
                OptionData(
                    OptionType.USER,
                    "user",
                    "actions.hug.options.user",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )

            executor = HugExecutor()
        }

        subCommand("laugh", "actions.laugh.description") {
            baseName = this@command.name
            executor = LaughExecutor()
        }

        subCommand("pat", "actions.pat.description") {
            baseName = this@command.name
            executor = PatExecutor()
        }

        subCommand("lick", "actions.lick.description") {
            baseName = this@command.name
            executor = LickExecutor()
        }

        subCommand("slap", "actions.slap.description") {
            baseName = this@command.name
            executor = SlapExecutor()
        }

        subCommand("smile", "actions.smile.description") {
            baseName = this@command.name
            executor = SmileExecutor()
        }

        subCommand("tickles", "actions.tickles.description") {
            baseName = this@command.name
            executor = TickleExecutor()
        }
    }
}